const db = require("../data/dbConfig");

module.exports = {
  find,
  findById,
  add
};

function find() {
  return db("users").select("id", "username", "department");
}

function findById(id) {
  return db("users")
    .select("id", "username", "department")
    .where({ id })
    .first();
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}
