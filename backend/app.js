const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const Meeting = require("./model");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const TOKEN_PATH = "token.json";
loadTokens();

function loadTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
  } else {
    console.log("No token found, please authenticate using /auth");
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

function ensureToken(req, res, next) {
  if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
    console.log("OAuth2 token is not set")
    return res.status(401).send("OAuth2 token is not set");
  }
  next();
}

app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.redirect(url);
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    saveTokens(tokens);

    res.send("Authentication successful! You can now close this tab.");
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).send("Error during authentication");
  }
});

app.post("/", ensureToken, async (req, res) => {
  const { name, email } = req.body;

  try {
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        summary: `Meeting with ${name}`,
        start: {
          dateTime: new Date().toISOString(),
        },
        end: {
          dateTime: new Date(
            Date.now() + 60 * 60 * 1000
          ).toISOString(),
        },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: "sample123",
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
        },
      }
    );

    const meetLink = response.data.hangoutLink;
    res.json({ meetLink });
  } catch (error) {
    console.error("Error creating meeting", error);
    res.status(500).send("Error creating meeting");
  }
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
