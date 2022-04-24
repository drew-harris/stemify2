import { getPrismaPool } from "../server_helpers/prismaPool";
import HomeButton from "../components/HomeButton";
import Head from "next/head";
import BigSong from "../components/Songs/BigSong";

export default function QueuePage({ songs }: any) {
  let songComponents = songs.map((song: any) => (
    <BigSong songData={song} width={"96"} key={song.id} setColors={() => {}} />
  ));
  return (
    <>
      <Head>
        <title>QUEUE</title>
      </Head>
      <HomeButton />
      <div className="text-lg font-bold text-center m-9">QUEUE</div>
      <div className="flex flex-col items-center justify-center gap-5 p-3 mx-auto m-9 ">
        {songComponents}
      </div>
    </>
  );
}

export async function getStaticProps({ req, res }: any) {
  const prisma = await getPrismaPool();
  let songs = await prisma.song.findMany({
    where: {
      complete: false,
    },
    select: {
      title: true,
      artist: true,
      album: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return {
    props: {
      songs,
    },
    revalidate: 10,
  };
}
