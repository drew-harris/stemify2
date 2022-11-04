import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { queueContext } from "../layouts/LibraryLayout";
export default function WideSong({ data, showTrackNumber = false }: any) {
  const { queueSongs, setQueueSongs, isUploading } = useContext(queueContext);
  const [added, setAdded] = useState(queueSongs.includes(data));

  useEffect(() => {
    setAdded(queueSongs.includes(data));
    console.log(data);
  }, [queueSongs, data]);

  const add = () => {
    if (!added) {
      setQueueSongs([...queueSongs, data]);
    } else {
      setQueueSongs(queueSongs.filter((song: any) => song.id !== data.id));
    }
  };

  return (
    <div className="flex flex-row items-center justify-between p-2 pl-4 overflow-hidden transition-shadow border-b shadow-sm shadow- border-tan-300 sm:4 hover:shadow-md">
      <div className="flex items-baseline gap-4">
        {showTrackNumber && (
          <div className="text-sm text-gray-600">{data.trackNum}</div>
        )}
        <div className="flex flex-row items-center truncate text-ellipsis ">
          {data.title}
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
