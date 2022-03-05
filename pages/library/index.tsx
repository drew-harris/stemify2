import { useEffect, useState } from "react";
import { getPrismaPool } from "../../server_helpers/prismaPool";
import Image from "next/image";

function Song({ data, limit }: any) {
  const [added, setAdded] = useState(false);
  const add = () => {
    setAdded(!added);
  };
  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 w-80 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden sm:w-12 sm:h-12 shrink-0 rounded-2xl sm:mr-4">
          <Image
            layout="fill"
            src={data.metadata.albumArt}
            alt={"Album Art for " + data.metadata.albumTitle}
          />
        </div>
        <div className="text-black truncate shrink">
          <div className="font-semibold truncate text-ellipsis">
            {data.title}
          </div>
          <div className="font-medium">{data.metadata.artist}</div>
        </div>
      </div>
      <button
        onClick={add}
        className={`rounded ${
          added ? "bg-tan-500" : "bg-tan-400"
        }  text-white p-1 px-2 ml-2 font-semibold hover:shadow-md hover:scale-105 transition-transform `}
      >
        {added ? "ADDED" : "ADD"}
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
    <>
      <div className="mx-auto text-2xl font-bold text-center mt-9">Library</div>

      <div className="flex flex-wrap items-center justify-center gap-3 p-3 sm:p-9 ">
        {songComponents}
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }: any) {
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

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=900, stale-while-revalidate=59"
  );
  return {
    props: {
      songs,
    },
  };
}
