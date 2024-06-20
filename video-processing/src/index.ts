import express from "express";
import { env } from "process";
import {
  createDirectories,
  deleteProcessedFile,
  deleteRawFile,
  downloadFile,
  processVideo,
  uploadFile,
} from "./storage";
import { isVideoNew, setVideo } from "./firestore";

const app = express();

createDirectories();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/process-video", async (req, res) => {
  try {
    const filename = JSON.parse(
      Buffer.from(req.body.message.data, "base64").toString("utf-8")
    ).name;
    const processedFileName = `processed-${filename}`;
    const videoId = filename.split(".")[0];

    if (!isVideoNew(videoId)) {
      return res
        .status(400)
        .send("Bad Request: video already processing or processed.");
    } else {
      await setVideo(videoId, {
        id: videoId,
        uid: videoId.split("-")[0],
        status: "processing",
      });
    }

    await downloadFile(filename);
    await processVideo(filename, processedFileName);
    await uploadFile(processedFileName);

    await setVideo(videoId, {
      status: "processed",
      filename: processedFileName,
    });

    await deleteRawFile(filename);
    await deleteProcessedFile(processedFileName);

    return res.status(200).send("Video processed");
  } catch (error) {
    console.error("Failed to process video:", error);
    return res.status(500).send("Failed to process video");
  }
});

const port = env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
