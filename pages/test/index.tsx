import { useEffect } from "react";
import { getPrismaPool } from "../../server_helpers/prismaPool";
import Image from "next/image";

function Song({ data }: any) {
  return (
    <div className="p-4 w-max bg-white rounded-xl flex shadow-sm flex-row justify-between items-center">
      <div className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden relative">
          <Image layout="fill" src={data.metadata.albumArt} alt="album art" />
        </div>
        <div>
          <div className="font-semibold">{data.title}</div>
          <div className="font-semibold">{data.metadata.artist}</div>
        </div>
      </div>
      <button className="rounded bg-tan-400 text-white p-1 px-2 ml-6 font-semibold">
        UPLOAD
      </button>
    </div>
  );
}

export default function Home({ songs }: any) {
  useEffect(() => {
    console.log(songs);
  }, [songs]);
  const songComponents = songs.map((song: any) => (
    <Song data={song} key={song.id} />
  ));

  return (
    <div className="p-32 flex justify-center flex-wrap gap-10">
      {songComponents}
    </div>
  );
}

export async function getServerSideProps() {
  const prisma = getPrismaPool();
  const songs = await prisma.song.findMany({
    where: {
      complete: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      metadata: true,
    },
  });
  console.log(songs);

  return {
    props: {
      songs,
    },
  };
}
