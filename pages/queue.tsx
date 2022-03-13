import { getPrismaPool } from "../server_helpers/prismaPool";
import BigSong from "../components/BigSong";
import HomeButton from "../components/HomeButton";

export default function QueuePage({ songs }: any) {
  let songComponents = songs.map((song: any) => (
    <BigSong songData={song} width={"96"} key={song.id} />
  ));
  return (
    <>
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
      submittedAt: "desc",
    },
  });

  return {
    props: {
      songs,
    },
    revalidate: 100,
  };
}
