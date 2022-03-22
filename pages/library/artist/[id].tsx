import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { Album } from "../../../components/Albums/Album";
import LibraryLayout from "../../../components/layouts/LibraryLayout";
import WideSong from "../../../components/Songs/WideSong";
import { getPrismaPool } from "../../../server_helpers/prismaPool";
import Image from "next/image";

function ArtistPage({ artist }: any) {
  const albumElements = artist?.albums?.map((album: any) => (
    <Album album={album} key={album.id} embedded={true} />
  ));
  if (!artist || !artist.albums) {
    return null;
  }
  return (
    <>
      <Head>
        <title>{artist?.name || "STEMIFY"}</title>
      </Head>
      <div className="p-8">
        <div className="flex items-end mb-8 info">
          <div className="relative w-8 h-8 mr-2 overflow-hidden rounded-full sm:w-32 sm:h-32 shrink-0 sm:mr-4">
            <Image
              layout="fill"
              quality={40}
              src={artist.image}
              alt={"Album Art for " + artist.name}
            />
          </div>
          <div className="text-4xl font-bold">{artist.name}</div>
        </div>
        <div>{albumElements}</div>
      </div>
    </>
  );
}

ArtistPage.getLayout = function getLayout(page: ReactElement) {
  console.log("layout loaded");
  if (!page.props.artist) {
    return (
      <LibraryLayout>
        <div></div>
      </LibraryLayout>
    );
  }
  return (
    <LibraryLayout>
      <ArtistPage artist={page.props.artist} {...page.props} />
    </LibraryLayout>
  );
};

export default ArtistPage;

export async function getStaticProps({ params }: any) {
  const id = params.id;
  const prisma = await getPrismaPool();
  const artist = await prisma.artist.findFirst({
    where: {
      id: id,
    },
    select: {
      image: true,
      name: true,
      albums: {
        orderBy: {
          popularity: "desc",
        },
        select: {
          id: true,
          title: true,
          artist: true,
          image: true,
          songs: {
            orderBy: {
              trackNum: "asc",
            },
          },
        },
      },
    },
  });

  return {
    props: {
      artist,
    },
    revalidate: 100000,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
