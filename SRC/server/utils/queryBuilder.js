// Helper function to build query
function buildQuery(table, params) {
    let query = `SELECT * FROM ${table}`;
    const values = [];
    const conditions = [];
  
    // Handle JOIN clauses
    if (params.join) {
      const joins = Array.isArray(params.join) ? params.join : [params.join];
      joins.forEach(join => {
        query += ` JOIN ${join}`;
      });
    }
  
    // Handle WHERE clauses
    if (params.where) {
      const whereConditions = Array.isArray(params.where) ? params.where : [params.where];
      whereConditions.forEach(condition => {
        conditions.push(condition);
      });
    }
  
    // Add conditions to the query
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
  
    // Handle ORDER BY clause
    if (params.orderBy) {
      query += ` ORDER BY ${params.orderBy}`;
    }
  
    // Handle LIMIT clause
    if (params.limit) {
      query += ` LIMIT ${params.limit}`;
    }
  
    return { query, values };
  }
  
  module.exports = { buildQuery };