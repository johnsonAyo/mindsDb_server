const MindsDB = require("mindsdb-js-sdk").default;

async function connectToMindsDB() {
  try {
    await MindsDB.connect({
      user: "",
      password: "",
    });
    console.log("Connected to MindsDB");
  } catch (error) {
    console.log("Failed to authenticate to MindsDB");
    console.log(error);
    throw error;
  }
}

module.exports = connectToMindsDB;
