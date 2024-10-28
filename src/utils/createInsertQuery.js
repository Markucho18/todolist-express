const createInsertQuery = (table, data) => {
  const keys = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map(() => "?").join(", ");
  const values = Object.values(data);
  const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
  return { query, values };
};

module.exports = createInsertQuery
