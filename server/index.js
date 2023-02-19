const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

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

app.post("/youtubeupload", (req, res) => {
  // req is valid video file
  console.log(req.body);

  // process the video file w/ the backend stuff
  const diffusedFile = () => {
    // do stuff
  };

  res.send({ diffusedFile: "filestorage name" });
});

app.post("/upload", (req, res) => {
  // req is valid video file
  console.log("here!!");
  console.log(req.body);

  res.send({ message: "Uploaded" });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
