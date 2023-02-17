// Les informations L1-L8 doivent être stockées dans un fichier env séparé en production !
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "Michael",
  host: "localhost",
  database: "api",
  password: "Toto_13",
  port: 5432,
});

// Get all users
const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// For our /users/:id request, we’ll get the custom id parameter by the URL and use a WHERE clause to display the result.
//In the SQL query, we’re looking for id=$1. In this instance, $1 is a numbered placeholder that PostgreSQL uses natively instead of the ? placeholder that you may recognize from other variations of SQL
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Post a new user
// The API will take a GET and POST request to the /users endpoint. In the POST request, we’ll add a new user. In this function, we’re extracting the name and email properties from the request body and inserting the values with INSERT
const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

// PUT updated data in an existing user
//The /users/:id endpoint will also take two HTTP requests, the GET we created for getUserById and a PUT to modify an existing user. For this query, we’ll combine what we learned in GET and POST to use the UPDATE clause.
// It’s worth noting that PUT is idempotent, meaning the exact same call can be made over and over and will produce the same result. PUT is different than POST, in which the exact same call repeated will continuously make new users with the same data
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (typeof results.rows == "undefined") {
        response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        response.status(404).send(`User not found`);
      } else {
        response
          .status(200)
          .send(`User modified with ID: ${results.rows[0].id}`);
      }
    }
  );
};

// Delete an user
// Finally, we’ll use the DELETE clause on /users/:id to delete a specific user by ID. This call is very similar to our getUserById() function
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

// Export modules
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
