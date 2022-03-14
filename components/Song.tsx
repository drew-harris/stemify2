import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { queueContext } from "./layouts/LibraryLayout";
import Link from "next/link";
export default function Song({ data, limit }: any) {
  const { queueSongs, setQueueSongs, isUploading } = useContext(queueContext);
  const [added, setAdded] = useState(queueSongs.includes(data));

  useEffect(() => {
    setAdded(queueSongs.includes(data));
  }, [queueSongs, data]);

  const add = () => {
    if (!added) {
      setQueueSongs([...queueSongs, data]);
    } else {
      setQueueSongs(queueSongs.filter((song: any) => song.id !== data.id));
    }
  };
  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden sm:w-12 sm:h-12 shrink-0 rounded-2xl sm:mr-4">
          <Image
            layout="fill"
            quality={40}
            src={data.album.image}
            alt={"Album Art for " + data.album.title}
          />
        </div>
        <div className="text-black truncate shrink">
          <Link href={`/song/${data.id}`} passHref={true}>
            <a className="font-semibold truncate text-ellipsis">{data.title}</a>
          </Link>
          <div className="font-medium">{data.artist.name}</div>
        </div>
      </div>
      {!isUploading ? (
        <button
          onClick={add}
          className={`rounded ${
            added ? "bg-tan-500" : "bg-tan-400"
          }  text-white p-1 px-2 sm:block hidden ml-2 font-semibold hover:shadow-md hover:scale-105 transition-transform `}
        >
          {added ? "ADDED" : "ADD"}
        </button>
      ) : null}
    </div>
  );
}
