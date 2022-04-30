import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { Album } from "../../../components/Albums/Album";
import LibraryLayout from "../../../components/layouts/LibraryLayout";
import WideSong from "../../../components/Songs/WideSong";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

function AlbumPage({ album }: any) {
  const songs = album?.songs;
  const songComponents = songs?.map((song: any) => (
    <WideSong showTrackNumber={true} data={song} key={song.id} />
  ));
  useEffect(() => {
    console.log(album);
  }, [album]);
  return (
    <>
      <Head>
        <title>{album?.title || "STEMIFY"}</title>
      </Head>
      <div className="p-8">
        <Album album={album} />
      </div>
    </>
  );
}

AlbumPage.getLayout = function getLayout(page: ReactElement) {
  console.log("layout loaded");
  if (!page.props.album) {
    return (
      <LibraryLayout>
        <div></div>
      </LibraryLayout>
    );
  }
  return (
    <LibraryLayout>
      <AlbumPage album={page.props.album} {...page.props} />
    </LibraryLayout>
  );
};

export default AlbumPage;

export async function getStaticProps({ params }: any) {
  const id = params.id;
  const prisma = await getPrismaPool();
  let album = await prisma.album.findFirst({
    where: {
      id: id,
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
        where: {
          complete: true,
        },
        include: {
          album: {
            select: {
              image: true,
            },
          },
          artist: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(album);
  return {
    props: {
      album,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
