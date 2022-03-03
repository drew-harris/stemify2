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
export async function uploadLinkToSlug(link: string, slug: string) {
  try {
    const bucket = getBucket();
    let blob = await bucket.file(`${slug}/input.mp3`);
    const blobStream = blob.createWriteStream();
    await ytdl.default(link, { filter: "audioonly" }).pipe(blobStream);

    blobStream.on("finish", async () => {
      console.log("DONE");
      return slug;
    });

    blobStream.on("error", (err: any) => {
      console.log(err);
      throw err;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
