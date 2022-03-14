import * as CloudStorage from "@google-cloud/storage";
import * as ytdl from "ytdl-core";
let storage: any = null;

const getBucket = () => {
  if (storage != null) {
    return storage.bucket("knw-demucs-input");
  } else {
    var private_value = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
    storage = new CloudStorage.Storage({
      projectId: "stemify2",
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: private_value,
      },
    });
    return storage.bucket("knw-demucs-input");
  }
};
export async function uploadLinkToSlug(
  link: string,
  slug: string
): Promise<any> {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const bucket = getBucket();
      console.log("UPLOADING");
      let blob = await bucket.file(`${slug}/input.mp3`);
      const blobStream = blob.createWriteStream();
      ytdl.default(link, { filter: "audioonly" }).pipe(blobStream);

      blobStream.on("finish", async () => {
        console.log("DONE");
        resolve({});
      });

      blobStream.on("error", (err: any) => {
        console.log(err);
        throw err;
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
  return promise;
}
