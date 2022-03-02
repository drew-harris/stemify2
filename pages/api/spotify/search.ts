// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSongData } from "../../../server_helpers/spotify";

type Metadata = {
  title: string;
  artist: string;
  metadata: {
    spotTrackId: string;
    trackNum: string;
    spotAlbumId: string;
    albumTitle: string;
    albumArt: string;
    artist: string;
    artistId: string;
    previewUrl: string;
  };
  bpm: null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ msg: "Method not allowed" });
  } else {
    const query = req.body.query;
    if (!query) {
      res.status(400).json({ error: "No query provided" });
      return;
    }
    const useFilter = req.body?.filter || false;

    const metadata: Metadata = await getSongData(query, useFilter);
    res.json(metadata);
  }
}
