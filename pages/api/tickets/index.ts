// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { uploadLinkToSlug } from "../../../server_helpers/gcstorage";
import { getPrismaPool } from "../../../server_helpers/prismaPool";
import { fillInArtistAndAlbum } from "../../../server_helpers/spotify";
import { getSession } from "next-auth/react";
import { createSong } from "../../../server_helpers/tickets";
import Song from "../../../components/Songs/Song";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        res.status(401).json({ msg: "Not authenticated" });
        return;
      }
      console.log(session);
      const url = req.body.url;
      let data = req.body.data;
      if (!url && !data) {
        res.status(400).json({ error: "No url or data provided" });
        return;
      }

      // See if already created
      const prisma = getPrismaPool();
      const checkSong = await prisma.song.findFirst({
        where: {
          id: data.id,
        },
      });
      if (checkSong != null) {
        res.status(303).json(checkSong);
        return;
      }

      // Create Slug
      const slug = createSlug(data.title);
      data.slug = slug;

      await uploadLinkToSlug(url, slug);

      data = await fillInArtistAndAlbum(data);

      const created = await createSong(url, data, false, session.user);

      const client = await getPrismaPool();
      const queuePos: number = await client.song.count({
        where: {
          complete: false,
          submittedAt: {
            lt: created.submittedAt,
          },
        },
      });

      res.json({
        song: created,
        queuePosition: queuePos,
      });
    } catch (error: any) {
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
