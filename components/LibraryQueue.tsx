import { useContext } from "react";
import { queueContext } from "./layouts/LibraryLayout";
import QueueSong from "./QueueSong";

export default function LibraryQueue(props: any) {
  const { queueSongs, setQueueSongs } = useContext(queueContext);
  const songElements = queueSongs.map((song: any) => (
    <QueueSong data={song} key={song.id} />
  ));
  return (
    <div className="sticky hidden sm:flex flex-col justify-between transition-shadow max-h-[80vh] top-20 sm:p-3 hover:shadow-md bg-tan-100 rounded-xl ">
      <div className="p-2 text-xl font-semibold text-center text-tan-400">
        UPLOAD QUEUE
      </div>
      <div className="flex flex-col gap-2 m-2 overflow-auto rounded grow ">
        {songElements}
      </div>
      {queueSongs.length > 0 && (
        <button className="hidden p-1 px-2 font-semibold text-white transition-transform rounded-lg bg-tan-400 sm:block hover:shadow-md ">
          UPLOAD
        </button>
      )}
    </div>
  );
}