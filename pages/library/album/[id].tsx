import Head from "next/head";
import { ReactElement, useEffect } from "react";
import HomeButton from "../../../components/HomeButton";
import LibraryLayout from "../../../components/layouts/LibraryLayout";
import Song from "../../../components/Songs/Song";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

function Album({ album }: any) {
  const songs = album?.songs;
  const songComponents = songs?.map((song: any) => (
    <Song data={song} key={song.id} />
  ));
  useEffect(() => {
    console.log(album);
  }, [album]);
  return (
    <>
      <Head>
        <title>{album?.title || "STEMIFY"}</title>
      </Head>
      {songComponents}
    </>
  );
}

Album.getLayout = function getLayout(page: ReactElement) {
  console.log("layout loaded");
  if (!page.props.album) {
    return <LibraryLayout>{page}</LibraryLayout>;
  }
  return (
    <LibraryLayout>
      <Album {...page.props} />
    </LibraryLayout>
  );
};

export default Album;

export async function getStaticProps({ req, res, params }: any) {
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
      songs: {
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
    revalidate: 100000,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
