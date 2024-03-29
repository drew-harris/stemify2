import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { queueContext } from "../layouts/LibraryLayout";
export default function Song({ data, limit }: any) {
  const { queueSongs, setQueueSongs, isUploading } = useContext(queueContext);
  const [added, setAdded] = useState(
    queueSongs.filter((song: any) => song.id === data.id).length > 0
  );

  const add = () => {
    if (!added) {
      setQueueSongs([...queueSongs, data]);
      setAdded(true);
    } else {
      setQueueSongs(queueSongs.filter((song: any) => song.id !== data.id));
      setAdded(false);
    }
  };

  useEffect(() => {
    setAdded(queueSongs.filter((song: any) => song.id === data.id).length > 0);
  }, [queueSongs, data.id]);
  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mr-4">
          <Link passHref={true} href={`/library/album/${data.album.id}`}>
            <Image
              layout="fill"
              quality={40}
              className="cursor-pointer"
              src={data.album.image}
              alt={"Album Art for " + data.album.title}
            />
          </Link>
        </div>
        <div className="text-black truncate shrink">
          <Link href={`/song/${data.id}`} passHref={true}>
            <a className="font-semibold truncate hover:underline text-ellipsis">
              {data.title}
            </a>
          </Link>

          <Link href={`/library/artist/${data.artist.id}`} passHref={true}>
            <a className="block font-medium cursor-pointer hover:underline">
              {data.artist.name}
            </a>
          </Link>
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
