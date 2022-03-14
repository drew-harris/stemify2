import Head from "next/head";
import { ReactElement } from "react";
import HomeButton from "../../components/HomeButton";
import LibraryLayout from "../../components/layouts/LibraryLayout";
import BigSong from "../../components/Songs/BigSong";
import { getPrismaPool } from "../../server_helpers/prismaPool";

function SingleSong({ song }: any) {
  return (
    <>
      <Head>
        <title>{song?.title || "STEMIFY"}</title>
      </Head>
      <HomeButton></HomeButton>
      <div className="flex flex-col items-center justify-center gap-5 p-3 mx-auto m-9 ">
        {song && <BigSong songData={song} width={"96"} />}
      </div>
    </>
  );
}

export default SingleSong;

export async function getStaticProps({ req, res, params }: any) {
  const id = params.id;
  const prisma = await getPrismaPool();
  let song = await prisma.song.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      artist: true,
      album: true,
    },
  });
  console.log(song);

  return {
    props: {
      song,
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
