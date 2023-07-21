// mindsDBQuery.js
const MindsDB = require("mindsdb-js-sdk").default;

async function connectAndCreateDatabase(connectionParams) {
  try {
    const mysqlDatabase = await MindsDB.Databases.createDatabase(
      "mysql_datasource",
      "mysql",
      connectionParams
    );
    console.log("Connected and created a database");
  } catch (error) {
    // Couldn't connect to database
    console.log(error);
    throw error;
  }
}

async function getDatabaseAndDelete() {
  try {
    const db = await MindsDB.Databases.getDatabase("mysql_datasource");
    console.log("Got a database");

    // Deleting a database (Uncomment the following lines to delete the database)
    if (db) {
      try {
        // await db.delete();
        console.log("Deleted a database");
      } catch (error) {
        // Couldn't delete a database
        console.log(error);
        throw error;
      }
    }
  } catch (error) {
    // Couldn't connect to database
    console.log(error);
    throw error;
  }
}

async function runMindsDBQuery() {
  try {
    const connectionParams = {
      user: "user",
      port: 3306,
      password: "MindsDBUser123!",
      host: "db-demo-data.cwoyhfn6bzs0.us-east-1.rds.amazonaws.com",
      database: "public",
    };

    await connectAndCreateDatabase(connectionParams);
    await getDatabaseAndDelete();

    const allProjects = await MindsDB.Projects.getAllProjects();
    console.log("all projects:");
    allProjects.forEach((p) => {
      console.log(p.name);
    });

    const query = `SELECT * FROM mysql_datasource.amazon_reviews`;

    try {
      // Running a query
      const queryResult = await MindsDB.SQL.runQuery(query);

      // Printing output
      console.log("Output first two rows:");
      //   console.log({ queryResult });
      if (queryResult.rows.length > 0) {
        console.log("is it in ");
        // console.log(queryResult.rows[0]);
        // console.log(queryResult.rows[1]);
      }
    } catch (error) {
      // Something went wrong sending the API request or executing the query
      console.log(error);
      throw error;
    }
  } catch (error) {
    console.log("Error while running MindsDB query");
    console.log(error);
    throw error;
  }
}

module.exports = runMindsDBQuery;
