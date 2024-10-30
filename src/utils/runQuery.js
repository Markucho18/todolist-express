const pool = require("../db")

const runQuery = (query, params = []) => {
  return pool.promise().query(query, params)
    .then(([rows]) => rows)
    .catch(error => {
      console.log("Hubo un error en runQuery: ", error);
      throw Error
    })
}

module.exports = runQuery