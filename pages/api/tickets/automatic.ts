// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { uploadLinkToSlug } from "../../../server_helpers/gcstorage";
import { getPrismaPool } from "../../../server_helpers/prismaPool";
import { createSong } from "../../../server_helpers/tickets";
import { getInfo } from "../../../server_helpers/youtube";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    try {
      const url = req.body.url;
      if (!url) {
        res.status(400).json({ error: "No url or data provided" });
        return;
      }

      // See if already created
      const prisma = getPrismaPool();

      const data: any = await getInfo(url, 1);
      if (!data) {
        res.status(400).json({ error: "No data found for link" });
        return;
      }
      const checkSong = await prisma.song.findFirst({
        where: {
          metadata: {
            spotTrackId: data[0].metadata.spotTrackId,
          },
        },
      });
      if (checkSong != null) {
        res.status(200).json(checkSong);
        return;
      }

      // Create Slug
      const slug = createSlug(data[0].title);
      data[0].slug = slug;

      await uploadLinkToSlug(url, slug);

      const created = await createSong(url, data[0], true);

      res.status(201).json(created);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

function createSlug(title: string) {
  return slugify(title + "-" + makeid(5), {
    replacement: "-",
    lower: true,
    strict: true,
  });
}

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
