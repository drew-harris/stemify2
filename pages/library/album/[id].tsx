import Head from "next/head";
import { ReactElement, useEffect } from "react";
import HomeButton from "../../../components/HomeButton";
import BigSong from "../../../components/Songs/BigSong";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

function SingleSong({ album }: any) {
  useEffect(() => {
    console.log(album);
  }, [album]);
  return (
    <>
      <Head>
        <title>{album?.title || "STEMIFY"}</title>
      </Head>
      <HomeButton></HomeButton>
    </>
  );
}

export default SingleSong;

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
      songs: true,
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
