import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

admin.initializeApp();

const firestore = admin.firestore();
const storage = new Storage();

const videoCollectionId = "videos";

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
}

const rawBucket = "raw-video-stream";

export const createUser = functions.auth.user().onCreate(async (user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
  };

  try {
    await firestore.collection("users").doc(user.uid).set(userInfo);
    logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  } catch (error) {
    logger.error("Error creating user document in Firestore:", error);
  }

  return;
});

export const UploadURL = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function much be called while authenticated"
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawBucket);

  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
  });

  return {url, fileName};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const snapshot = firestore.collection(videoCollectionId).limit(10).get();
  return (await snapshot).docs.map((doc) => doc.data());
});
