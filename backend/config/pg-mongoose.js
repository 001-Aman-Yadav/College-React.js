import { pool } from './db.js';
import crypto from 'crypto';

// Helper to convert mongoose style queries into PostgreSQL SQL WHERE clause
function parseQuery(queryObj) {
  if (!queryObj || Object.keys(queryObj).length === 0) {
    return { where: '1=1', values: [] };
  }

  let conditions = [];
  let values = [];
  let paramCount = 1;

  function processCondition(key, val) {
    if (key === '$or' && Array.isArray(val)) {
      const orParts = [];
      for (const item of val) {
        const itemKeys = Object.keys(item);
        for (const ik of itemKeys) {
          const res = processSingleCondition(ik, item[ik]);
          if (res) orParts.push(res);
        }
      }
      if (orParts.length > 0) {
        return `(${orParts.join(' OR ')})`;
      }
      return null;
    }
    return processSingleCondition(key, val);
  }

  function processSingleCondition(key, val) {
    // If value is regex object
    if (val && typeof val === 'object' && '$regex' in val) {
      const pattern = `%${val.$regex}%`;
      values.push(pattern);
      const idx = paramCount++;
      return `data->>'${key}' ILIKE $${idx}`;
    }
    if (val && typeof val === 'object' && '$ne' in val) {
      values.push(String(val.$ne));
      const idx = paramCount++;
      return `data->>'${key}' != $${idx}`;
    }
    // Default equality: if key is _id, search by primary key
    if (key === '_id') {
      values.push(String(val));
      const idx = paramCount++;
      return `_id = $${idx}`;
    }
    values.push(String(val));
    const idx = paramCount++;
    return `data->>'${key}' = $${idx}`;
  }

  for (const k of Object.keys(queryObj)) {
    const cond = processCondition(k, queryObj[k]);
    if (cond) {
      conditions.push(cond);
    }
  }

  return {
    where: conditions.length > 0 ? conditions.join(' AND ') : '1=1',
    values
  };
}

class Schema {
  constructor(definition, options = {}) {
    this.definition = definition;
    this.options = options;
    this.methods = {};
    this.statics = {};
    this.hooks = {
      pre: {}
    };
  }

  pre(hookName, fn) {
    if (!this.hooks.pre[hookName]) {
      this.hooks.pre[hookName] = [];
    }
    this.hooks.pre[hookName].push(fn);
  }

  post(hookName, fn) {
    // Dummy post hook
  }
}

// Define Schema types to match mongoose Schema.Types.ObjectId
Schema.Types = {
  ObjectId: 'ObjectId',
  String: 'String',
  Number: 'Number',
  Date: 'Date',
  Boolean: 'Boolean'
};

// Emulates a mongoose document instance
class DocumentInstance {
  constructor(tableName, data, schema, isNew = false) {
    this._tableName = tableName;
    this._schema = schema;
    this._isNew = isNew;
    this._originalData = JSON.parse(JSON.stringify(data));
    
    // Set standard properties
    this._id = data._id || data.id;
    
    // Copy all data properties directly onto this object
    Object.assign(this, data);
    
    // Attach custom methods defined on the schema
    if (schema && schema.methods) {
      for (const methodName of Object.keys(schema.methods)) {
        this[methodName] = schema.methods[methodName].bind(this);
      }
    }
  }

  isModified(path) {
    if (this._isNew) {
      return this[path] !== undefined;
    }
    if (path === 'password') {
      return this.password !== this._originalData.password;
    }
    return this[path] !== this._originalData[path];
  }

  // Populate helper on the instance (rarely used, but good to have)
  async populate(path) {
    const paths = typeof path === 'string' ? [path] : path;
    for (const p of paths) {
      let refId = this[p];
      if (refId && typeof refId === 'string') {
        // Resolve reference
        let refModelName = '';
        if (p === 'course') refModelName = 'courses';
        else if (p === 'student') refModelName = 'students';
        else if (p === 'teacher') refModelName = 'teachers';
        else if (p === 'user') refModelName = 'users';

        if (refModelName) {
          const res = await pool.query(`SELECT * FROM ${refModelName} WHERE _id = $1`, [refId]);
          if (res.rows.length > 0) {
            this[p] = new DocumentInstance(refModelName, { ...res.rows[0].data, _id: res.rows[0]._id }, null);
          }
        }
      }
    }
    return this;
  }

  async save() {
    // Run pre-save hooks
    if (this._schema && this._schema.hooks && this._schema.hooks.pre['save']) {
      const hooks = this._schema.hooks.pre['save'];
      for (const hook of hooks) {
        await new Promise((resolve, reject) => {
          hook.call(this, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    // Clean up internal properties for database storage
    const docData = {};
    for (const key of Object.keys(this)) {
      if (!key.startsWith('_')) {
        docData[key] = this[key];
      }
    }
    
    // Ensure _id exists inside data and matching primary key
    docData._id = this._id;
    
    if (this._isNew) {
      try {
        await pool.query(
          `INSERT INTO ${this._tableName} (_id, data) VALUES ($1, $2)`,
          [this._id, JSON.stringify(docData)]
        );
        this._isNew = false;
        this._originalData = JSON.parse(JSON.stringify(docData));
      } catch (err) {
        if (err.code === '23505') {
          const mongoErr = new Error('Duplicate key error');
          mongoErr.code = 11000;
          throw mongoErr;
        }
        throw err;
      }
    } else {
      try {
        await pool.query(
          `UPDATE ${this._tableName} SET data = $2, updated_at = CURRENT_TIMESTAMP WHERE _id = $1`,
          [this._id, JSON.stringify(docData)]
        );
        this._originalData = JSON.parse(JSON.stringify(docData));
      } catch (err) {
        if (err.code === '23505') {
          const mongoErr = new Error('Duplicate key error');
          mongoErr.code = 11000;
          throw mongoErr;
        }
        throw err;
      }
    }
    return this;
  }
}

// Chained Query Builder for Mongoose .find()
class QueryBuilder {
  constructor(tableName, queryObj, schema) {
    this.tableName = tableName;
    this.queryObj = queryObj;
    this.schema = schema;
    this.skipCount = 0;
    this.limitCount = null;
    this.sortObj = null;
    this.populates = [];
    this.isFindOne = false;
  }

  skip(count) {
    this.skipCount = count;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  sort(sortObj) {
    this.sortObj = sortObj;
    return this;
  }

  populate(path) {
    this.populates.push(path);
    return this;
  }

  select(fields) {
    // Dummy select for chaining compatibility
    return this;
  }

  async execute() {
    const { where, values } = parseQuery(this.queryObj);
    let sql = `SELECT * FROM ${this.tableName} WHERE ${where}`;

    if (this.sortObj) {
      let sortField = 'created_at';
      let sortOrder = 'ASC';
      if (typeof this.sortObj === 'string') {
        if (this.sortObj.startsWith('-')) {
          sortField = this.sortObj.substring(1);
          sortOrder = 'DESC';
        } else {
          sortField = this.sortObj;
        }
      } else if (typeof this.sortObj === 'object') {
        const key = Object.keys(this.sortObj)[0];
        sortField = key;
        sortOrder = this.sortObj[key] === -1 ? 'DESC' : 'ASC';
      }

      if (sortField === 'createdAt' || sortField === 'created_at') {
        sql += ` ORDER BY created_at ${sortOrder}`;
      } else if (sortField === 'updatedAt' || sortField === 'updated_at') {
        sql += ` ORDER BY updated_at ${sortOrder}`;
      } else {
        sql += ` ORDER BY data->>'${sortField}' ${sortOrder}`;
      }
    } else {
      sql += ` ORDER BY created_at DESC`;
    }

    if (this.limitCount !== null) {
      sql += ` LIMIT ${Number(this.limitCount)}`;
    }
    if (this.skipCount > 0) {
      sql += ` OFFSET ${Number(this.skipCount)}`;
    }

    const res = await pool.query(sql, values);
    const docs = res.rows.map(row => {
      const data = { ...row.data, _id: row._id, createdAt: row.created_at, updatedAt: row.updated_at };
      return new DocumentInstance(this.tableName, data, this.schema);
    });

    // Handle populate
    if (this.populates.length > 0) {
      for (const doc of docs) {
        for (const popPath of this.populates) {
          const pathName = typeof popPath === 'object' ? popPath.path : popPath;
          let refId = doc[pathName];
          if (refId && typeof refId === 'string') {
            let refModel = '';
            if (pathName === 'course') refModel = 'courses';
            else if (pathName === 'student') refModel = 'students';
            else if (pathName === 'teacher') refModel = 'teachers';
            else if (pathName === 'user') refModel = 'users';

            if (refModel) {
              const refRes = await pool.query(`SELECT * FROM ${refModel} WHERE _id = $1`, [refId]);
              if (refRes.rows.length > 0) {
                let subDocData = { ...refRes.rows[0].data, _id: refRes.rows[0]._id, createdAt: refRes.rows[0].created_at, updatedAt: refRes.rows[0].updated_at };
                let popDoc = new DocumentInstance(refModel, subDocData, null);
                
                if (typeof popPath === 'object' && popPath.select) {
                  const selectFields = popPath.select.split(' ');
                  const filteredDoc = { _id: popDoc._id };
                  for (const f of selectFields) {
                    if (f && f !== '_id') filteredDoc[f] = popDoc[f];
                  }
                  doc[pathName] = filteredDoc;
                } else {
                  doc[pathName] = popDoc;
                }
              }
            }
          }
        }
      }
    }

    if (this.isFindOne) {
      return docs.length > 0 ? docs[0] : null;
    }
    return docs;
  }

  // Support thenable so "await Model.find()" works directly
  then(onfulfilled, onrejected) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

// Base Model Class
class Model {
  constructor(tableName, schema) {
    this.tableName = tableName;
    this.schema = schema;
  }

  find(query) {
    return new QueryBuilder(this.tableName, query, this.schema);
  }

  findOne(query) {
    const qb = new QueryBuilder(this.tableName, query, this.schema).limit(1);
    qb.isFindOne = true;
    return qb;
  }

  findById(id) {
    const query = id ? { _id: String(id) } : { _id: 'non_existent_id_value_to_avoid_match' };
    return this.findOne(query);
  }

  async create(data) {
    const _id = data._id || data.id || crypto.randomUUID();
    const instData = { ...data, _id };
    const inst = new DocumentInstance(this.tableName, instData, this.schema, true);
    await inst.save();
    return inst;
  }

  async insertMany(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('insertMany expects an array');
    }
    const instances = [];
    for (const item of arr) {
      const inst = await this.create(item);
      instances.push(inst);
    }
    return instances;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (!id) return null;
    const inst = await this.findById(id);
    if (!inst) return null;

    for (const key of Object.keys(updateData)) {
      inst[key] = updateData[key];
    }
    await inst.save();
    return inst;
  }

  async findByIdAndDelete(id) {
    if (!id) return null;
    const inst = await this.findById(id);
    if (!inst) return null;
    await pool.query(`DELETE FROM ${this.tableName} WHERE _id = $1`, [String(id)]);
    return inst;
  }

  async countDocuments(query) {
    const { where, values } = parseQuery(query);
    const sql = `SELECT COUNT(*)::INTEGER as count FROM ${this.tableName} WHERE ${where}`;
    const res = await pool.query(sql, values);
    return res.rows[0].count;
  }

  async aggregate(pipeline) {
    if (this.tableName === 'payments') {
      const match = pipeline.find(p => p.$match);
      const isSuccess = match && match.$match.status === 'Success';
      const sql = `SELECT COALESCE(SUM((data->>'amount')::NUMERIC), 0) AS total FROM payments WHERE data->>'status' = $1`;
      const res = await pool.query(sql, [isSuccess ? 'Success' : 'Failed']);
      return [{ _id: null, total: Number(res.rows[0].total) }];
    }

    if (this.tableName === 'students') {
      const isCourseStats = pipeline.some(p => p.$group && p.$group._id === '$course');
      if (isCourseStats) {
        const sql = `
          SELECT (s.data->>'course') AS course_id, COUNT(*)::INTEGER AS count, (c.data->>'name') AS course_name
          FROM students s
          LEFT JOIN courses c ON c._id = s.data->>'course'
          WHERE s.data->>'status' = 'Approved'
          GROUP BY s.data->>'course', c.data->>'name'
        `;
        const res = await pool.query(sql);
        return res.rows.map(row => ({
          _id: row.course_id,
          count: row.count,
          courseName: row.course_name
        }));
      }

      const isCategoryStats = pipeline.some(p => p.$group && p.$group._id === '$category');
      if (isCategoryStats) {
        const sql = `
          SELECT (data->>'category') AS category, COUNT(*)::INTEGER AS count
          FROM students
          WHERE data->>'status' = 'Approved'
          GROUP BY data->>'category'
        `;
        const res = await pool.query(sql);
        return res.rows.map(row => ({
          _id: row.category,
          count: row.count
        }));
      }
    }

    return [];
  }
}

// Factory function
function model(modelName, schema) {
  const tableName = modelName.toLowerCase() + 's';
  return new Model(tableName, schema);
}

const mongoose = {
  Schema,
  model,
  Types: {
    ObjectId: {
      isValid: (id) => typeof id === 'string' && id.length > 0
    }
  }
};

export { Schema, model };
export default mongoose;
