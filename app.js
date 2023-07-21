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

    const axiosInstance = axios.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `session=${sessionToken}`,
      },
    });

    const query = `SELECT * FROM mindsdb.mindsdb.tutor_model WHERE author_username = '${authorUsername}' AND text = '${searchText}';`;

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

app.get("/", async (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to the MindDB Language Tutor API</title>
    </head>
    <body>
        <div style="text-align: center; margin-top: 100px;">
            <h1>Welcome to the MindDB Language Tutor API</h1>
            <p>Explore the realm of languages, where knowledge blooms,</p>
            <p>Amidst the digital dreams, where wisdom looms.</p>
            <p>Embark on a journey, where words come alive,</p>
            <p>In the magical dance of intellect, you shall thrive.</p>
            <p>Step forth to the gateway, with hearts bold and keen,</p>
            <p>Where the chat-box awaits, in this mystical scene.</p>
            <p>Through the API's embrace, the quest shall ignite,</p>
            <p>As understanding and learning take flight.</p>
            <p>So let the adventure begin, with minds open wide,</p>
            <p>In the MindDB Language Tutor, where wisdom resides.</p>
            <br>
            <p>Visit <code>app.post("/api/chat-box", async (req, res)</code> to start</p>
        </div>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");

  res.status(500).send(htmlContent);
});

app.post("/api/chat-box", async (req, res) => {
  try {
    const { searchText, authorUsername } = req.body;

    const data = await mindDbQueryCall(authorUsername, searchText);

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
