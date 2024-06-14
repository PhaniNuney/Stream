import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

const generateUploadURL = httpsCallable(functions, "UploadURL");

export async function uploadVideo(file: File) {
  const response: any = await generateUploadURL({
    fileExtension: file.name.split(".").pop(),
  });

  await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return;
}