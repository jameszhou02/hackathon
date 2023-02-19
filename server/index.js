const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const youtubedl = require("youtube-dl-exec");
const stream = require("stream");
const fs = require("fs");
const streamifier = require("streamifier");
const { promisify } = require("util");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "hackathon-8e9ac.firebaseapp.com",
});
//use python sdk to upload to firestore, save file name and pass to frontend s

const bucket = admin.storage().bucket();

const app = express();

app.use(cors());
app.use(
  express.json({
    type: "*/*", // optional, only if you want to be sure that everything is parsed as JSON. Wouldn't recommend
  })
);

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  const pythonProcess = spawn("python3", ["./test.py"]);
  let dataToSend;
  // Listen for data from the Python process
  pythonProcess.stdout.on("data", (data) => {
    dataToSend = data.toString();
    console.log(`Data from Python: ${data}`);
  });

  // Listen for errors from the Python process
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python: ${data}`);
  });

  // Listen for the Python process to exit
  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  res.send({ message: dataToSend });
});

app.post("/uploadyoutube", async (req, res) => {
  console.log(req.body);

  let id = req.body.url;
  id = id.split("v=")[1];
  // download video file from youtube
  const output = id + ".mp3";

  await youtubedl(req.body.url, {
    extractAudio: true,
    audioFormat: "mp3",
    output: output,
  });

  const fileName = "./" + output;
  const bucket = admin.storage().bucket();

  const metadata = {
    // metadata: {
    //   // This line is very important. It's to create a download token.
    //   firebaseStorageDownloadTokens: uuid(),
    // },
    contentType: "audio/mp3",
  };

  // Uploads a local file to the bucket
  await bucket.upload(fileName, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    metadata: metadata,
  });

  console.log(`${fileName} uploaded.`);
});

app.post("/upload", async (req, res) => {
  // req is valid video file
  console.log("here!!");
  console.log(req.body);

  res.send({ message: "Uploaded" });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
