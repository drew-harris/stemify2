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

export async function getServerSideProps({ req, res }: any) {
  try {
    const prisma = await getPrismaPool();
    const songs = await prisma.song.findMany({
      where: {
        complete: false,
      },
      select: {
        title: true,
        metadata: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=90, stale-while-revalidate=59"
    );
    return {
      props: {
        songs,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
