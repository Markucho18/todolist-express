const createUpdateQuery = (table, id, data, userId = 0) => {
  console.log("createUpdateQuery: ")
  console.log({table, id, data})
  const keys = Object.keys(data)
  const values = Object.values(data)
  const queryValues = keys.map((key, i) =>{
    return `${key} = ?`
  }).join(", ")
  const query = `UPDATE ${table} SET ${queryValues} WHERE task_id = ? ${userId ? "AND user_id = ?" : ""}`
  return {query, queryValues: [...values, id, userId]}
}

module.exports = createUpdateQuery