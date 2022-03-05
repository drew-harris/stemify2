import { useContext, useState } from "react";
import Image from "next/image";
import { queueContext } from "./layouts/LibraryLayout";
export default function QueueSong({ data, limit }: any) {
  const { queueSongs, setQueueSongs } = useContext(queueContext);
  const [added, setAdded] = useState(queueSongs.includes(data));
  const add = () => {
    setAdded(!added);
    setQueueSongs([...queueSongs, data]);
  };
  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden rounded-full sm:w-10 sm:h-10 shrink-0 sm:mr-3">
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
    </div>
  );
}
