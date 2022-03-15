import { getPrismaPool } from "./prismaPool";

export async function createSong(
  url: string,
  data: any,
  automatic: boolean,
  user: any
) {
  const prisma = getPrismaPool();
  let song = null;
  song = await prisma.song.create({
    data: {
      id: data.id,
      title: data.title,
      bpm: data.bpm,
      popularity: data.popularity,
      previewUrl: data.previewUrl,
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
      innerColor: data.innerColor as string | "#FF0000",
      outerColor: data.outerColor as string | "#0000FF",
      automatic: automatic,
      approved: false,
      complete: false,
    },
    include: {
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
  return { song };
}
