import { useContext } from "react";
import { queueContext } from "./layouts/LibraryLayout";
import QueueSong from "./QueueSong";

export default function LibraryQueue(props: any) {
  const { queueSongs, setQueueSongs } = useContext(queueContext);
  const songElements = queueSongs.map((song: any) => (
    <QueueSong data={song} key={song.id} />
  ));
  return (
    <div className="sticky top-20 p-3 overflow-auto max-h-[80vh] bg-tan-100 rounded-xl flex flex-col gap-2">
      <div className="p-4 text-xl text-center text-tan-500">Queue</div>
      {songElements}
    </div>
  );
}
