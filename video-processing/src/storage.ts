import { Storage } from "@google-cloud/storage";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const rawBucket = "raw-video-stream";
const processedBucket = "processed-video-stream";

const localRawPath = "./raw";
const localProcessedPath = "./processed";

const storage = new Storage();

export function createDirectories() {
  folderExists(localRawPath);
  folderExists(localProcessedPath);
}

function folderExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
    console.log(`Created directory: ${directory}`);
  }
}

export async function downloadFile(fileName: string) {
  await storage
    .bucket(rawBucket)
    .file(fileName)
    .download({ destination: `${localRawPath}/${fileName}` });

  console.log(
    `gs://${rawBucket}/${fileName} downloaded to ${localRawPath}/${fileName}`
  );
}

export async function uploadFile(fileName: string) {
  await storage
    .bucket(processedBucket)
    .upload(`${localProcessedPath}/${fileName}`);

  console.log(
    `${localProcessedPath}/${fileName} uploaded to gs://${processedBucket}/${fileName}`
  );

  await storage.bucket(processedBucket).file(fileName).makePublic();
}

export async function processVideo(fileName: string, saveFileName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawPath}/${fileName}`)
      .outputOptions("-vf", "scale=1920:-1")
      .on("end", () => {
        console.log("Processing finished");
        resolve();
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
        reject(err);
      })
      .save(`${localProcessedPath}/${saveFileName}`);
  });
}

export async function deleteRawFile(fileName: string) {
  await deleteFile(localRawPath, fileName);
}

export async function deleteProcessedFile(fileName: string) {
  await deleteFile(localProcessedPath, fileName);
}

async function deleteFile(directory: string, fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(`${directory}/${fileName}`, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        reject(err);
      } else {
        console.log(`Deleted ${directory}/${fileName}`);
        resolve();
      }
    });
  });
}
