import { useContext, useEffect, useState } from "react";
import { queueContext } from "./layouts/LibraryLayout";
import QueueSong from "./Songs/QueueSong";

let sdk: any = null;

async function getDownload(data: any) {
  if (!data.id) {
    throw new Error("No song id");
  }
  try {
    const response = await fetch(
      "/api/download?" +
        new URLSearchParams({
          id: data.id,
        })
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Could not get links");
    }
  } catch (error) {
    throw error;
  }
}

export default function LibraryQueue(props: any) {
  const { queueSongs, isUploading, setIsUploading } = useContext(queueContext);
  const songElements = queueSongs.map((song: any) => (
    <QueueSong data={song} key={song.id} />
  ));

  const [songMessage, setSongMessage] = useState("");

  useEffect(() => {
    async function init() {
      // @ts-ignore haha deal with it later
      sdk = await import("stem-player-sdk");
      console.log(sdk);
    }
    init();
  }, []);

  async function uploadOne(data: any) {
    setSongMessage("Downloading");
    const links = await getDownload(data);
    // Make the track
    const track = {
      title: data.title,
      vocals: links.vocals,
      bass: links.bass,
      drums: links.drums,
      other: links.other,
      bpm: data.bpm,
      colors: [data.innerColor, data.outerColor],
    };

    try {
      // Generate track
      await sdk.connect();
      const t = await sdk.generateTrack(track);
      await sdk.upload(t, (uploadInfo: any) => {
        setSongMessage(Math.round(uploadInfo.total * 100) + "%");
      });
      await sdk.disconnect();

      return 1;
    } catch (error) {
      console.error(error);
      alert("Error uploading song");
    }
  }

  const uploadAll = async () => {
    if (queueSongs.length === 0) {
      alert("No songs in queue");
      return;
    }
    setIsUploading(true);
    while (queueSongs.length > 0) {
      try {
        const songToUpload = queueSongs[0];
        await uploadOne(songToUpload);
      } catch (error) {
        console.error(error);
      } finally {
        queueSongs.shift();
      }

      // Remove first element
    }
    setIsUploading(false);
    setSongMessage("");
  };
  return (
    <div className="sticky hidden sm:flex flex-col justify-between transition-shadow max-h-[80vh] top-20 sm:p-3 hover:shadow-md bg-tan-100 rounded-xl ">
      <div className="p-1 text-lg font-semibold text-center text-tan-400">
        UPLOAD QUEUE
      </div>
      <div className="flex flex-col gap-1 m-2 overflow-auto rounded grow ">
        {songElements}
      </div>
      <div>{songMessage}</div>
      {queueSongs.length > 0 ? (
        <button
          onClick={uploadAll}
          className={`hidden p-1 px-2 font-semibold text-white transition-transform rounded-lg ${
            isUploading ? "bg-tan-500" : "bg-tan-400"
          } sm:block hover:shadow-md `}
        >
          {isUploading ? "UPLOADING..." : "UPLOAD ALL"}
        </button>
      ) : null}
    </div>
  );
}
