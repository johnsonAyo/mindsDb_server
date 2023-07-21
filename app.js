const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.use(express.json());

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const port = process.env.PORT;

const mindDbQueryCall = async (authorUsername, searchText) => {
  try {
    // Connect and get the session token
    const loginResponse = await axios.post(
      "https://cloud.mindsdb.com/cloud/login",
      {
        email,
        password,
      }
    );

    const setCookieHeader = loginResponse.headers["set-cookie"];
    const sessionCookie = setCookieHeader.find((cookie) =>
      cookie.startsWith("session=")
    );
    let sessionToken = null;
    if (sessionCookie) {
      const startIndex = sessionCookie.indexOf("=") + 1;
      sessionToken = sessionCookie.substring(startIndex, sessionCookie.length);
    }

    // Set the session token in the headers for subsequent requests
    const axiosInstance = axios.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `session=${sessionToken}`,
      },
    });

    const query = `SELECT * FROM mindsdb.mindsdb.tutor_model WHERE author_username = '${authorUsername}' AND text = '${searchText}';`;

    // Query the API
    const response = await axiosInstance.post(
      "https://cloud.mindsdb.com/api/sql/query",
      {
        query,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Express route
app.post("/api/chat-box", async (req, res) => {
  try {
    // Get searchText and authorUsername from req.body
    const { searchText, authorUsername } = req.body;

    // Perform the API call
    const data = await mindDbQueryCall(authorUsername, searchText);

    // Send the response
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
