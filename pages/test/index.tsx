import { useEffect, useState } from "react";
import { getPrismaPool } from "../../server_helpers/prismaPool";
import Image from "next/image";

function Song({ data, limit }: any) {
  const [added, setAdded] = useState(false);
  const add = () => {
    setAdded(!added);
  };
  return (
    <div
      className="p-4 w-80 overflow-hidden bg-white rounded-xl flex hover:shadow-md 
    transition-shadow shadow-sm flex-row justify-between gap-3 items-center"
    >
      <div className="flex truncate text-ellipsis flex-row ">
        <div className="w-12 h-12 shrink-0 overflow-hidden rounded-2xl relative mr-4">
          <Image
            layout="fill"
            src={data.metadata.albumArt}
            alt={"Album Art for " + data.metadata.albumTitle}
          />
        </div>
        <div className="shrink truncate">
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
      <div className="text-2xl mx-auto mt-9 text-center font-bold">Library</div>
      <div className="p-9 flex flex-wrap justify-evenly gap-2 gap-y-8">
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
  console.log(songs);

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=9000, stale-while-revalidate=59"
  );
  return {
    props: {
      songs,
    },
  };
}
