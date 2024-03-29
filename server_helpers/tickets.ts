import { getPrismaPool } from "./prismaPool";

export async function createSong(
  url: string,
  data: any,
  automatic: boolean,
  user: any
) {
  const prisma = getPrismaPool();
  let song = null;

  let innerColor = data.innerColor || "#FF0000";
  let outerColor = data.outerColor || "#0000FF";

  song = await prisma.song.create({
    data: {
      id: data.id,
      title: data.title,
      bpm: data.bpm,
      popularity: data.popularity,
      previewUrl: data.previewUrl,
      trackNum: data.trackNum,
      artist: {
        connectOrCreate: {
          where: {
            id: data.artist.id,
          },
          create: {
            id: data.artist.id,
            name: data.artist.name,
            image: data.artist.image,
            popularity: data.artist.popularity,
            followers: data.artist.followers,
          },
        },
      },
      album: {
        connectOrCreate: {
          where: {
            id: data.album.id,
          },
          create: {
            id: data.album.id,
            title: data.album.title,
            image: data.album.image,
            popularity: data.album.popularity,
            artist: {
              connectOrCreate: {
                where: {
                  id: data.artist.id,
                },
                create: {
                  id: data.artist.id,
                  name: data.artist.name,
                  image: data.artist.image,
                  popularity: data.artist.popularity,
                  followers: data.artist.followers,
                },
              },
            },
          },
        },
      },
      ticket: {
        create: {
          slug: data.slug,
          youtubeUrl: url,
          complete: false,
        },
      },
      innerColor,
      outerColor,
      automatic: automatic,
      approved: false,
      complete: false,
    },
    select: {
      album: true,
      artist: true,
      id: true,
      title: true,
      complete: true,
      previewUrl: true,
      submittedAt: true,

      ticket: {
        select: {
          id: true,
        },
      },
    },
  });
  if (user) {
    const gotUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    await prisma.song.update({
      where: {
        id: song.id,
      },
      data: {
        user: {
          connect: {
            id: gotUser!.id,
          },
        },
      },
    });
  }
  return song;
}
