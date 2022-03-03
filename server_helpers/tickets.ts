import { getPrismaPool } from "./prismaPool";
import slugify from "slugify";

export async function createSong(url: string, data: any, automatic: boolean) {
  const prisma = getPrismaPool();
  const song = await prisma.song.create({
    data: {
      title: data.title,
      artist: data.artist,
      innerColor: data.innerColor || "#FF0000",
      outerColor: data.outerColor || "#0000FF",
      bpm: data.bpm,
      automatic: automatic,
      youtubeUrl: url,
      metadata: {
        create: {
          spotAlbumId: data.metadata.spotAlbumId,
          spotTrackId: data.metadata.spotTrackId,
          albumArt: data.metadata.albumArt,
          albumTitle: data.metadata.albumTitle,
          artist: data.metadata.artist,
          artistId: data.metadata.artistId,
          previewUrl: data.metadata.previewUrl || null,
          trackNum: data.metadata.trackNum || 1,
        },
      },
      ticket: {
        create: {
          slug: data.slug,
        },
      },
    },
    include: {
      ticket: {
        select: {
          id: true,
        },
      },
      metadata: true,
    },
  });
  return { song };
}
