import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { queueContext } from "../layouts/LibraryLayout";
export default function QueueSong({ data, limit }: any) {
  const { queueSongs, setQueueSongs } = useContext(queueContext);

  const remove = () => {
    setQueueSongs(queueSongs.filter((song: any) => song.id !== data.id));
  };
  return (
    <div className="flex flex-row items-center justify-between p-1 overflow-hidden transition-shadow bg-white shadow-md shrink-0 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-6 h-6 mr-2 overflow-hidden rounded-full sm:w-6 sm:h-6 shrink-0 sm:mr-3">
          <Image
            quality={40}
            layout="fill"
            src={data.album.image}
            alt={"Album Art for " + data.album.title}
          />
        </div>
        <div className="text-black truncate shrink">
          <div className="font-semibold truncate text-ellipsis">
            {data.title}
          </div>
        </div>
      </div>
      <button className="pr-4 ml-2" onClick={remove}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
