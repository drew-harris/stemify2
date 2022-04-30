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
      let data = req.body.data;
      if (!data) {
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
      // const slug = createSlug(data.title);

      if (!data.slug) {
        return res.status(400).json({ error: "No slug provided" });
      }

      // await uploadLinkToSlug(url, slug);

      // data = await fillInArtistAndAlbum(data);

      data.artist.followers = 9090292;
      data.artist.image =
        "https://i.scdn.co/image/ab6761610000e5ebfbc3faec4a370d8393bee7f1";
      data.artist.popularity = 100;
      data.album.popularity = 100;
      data.album.totalSongs = 19;

      // TODO: Change null to user
      const created = await createSong("", data, false, session.user);

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
