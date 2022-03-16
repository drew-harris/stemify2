import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

let sdk: any = null;
export default function BiggestSong({ songData }: any) {
  useEffect(() => {
    async function init() {
      // @ts-ignore haha deal with it later
      sdk = await import("stem-player-sdk");
      console.log(sdk);
    }
    init();
  }, []);

  const [songMessage, setSongMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload() {
    setUploading(true);
    const links = await getDownload(songData);
    // Make the track
    const track = {
      title: songData.title,
      vocals: links.vocals,
      bass: links.bass,
      drums: links.drums,
      other: links.other,
      bpm: songData.bpm,
      colors: [songData.innerColor, songData.outerColor],
    };

    try {
      // Generate track
      await sdk.connect();
      const t = await sdk.generateTrack(track);
      await sdk.upload(t, (uploadInfo: any) => {
        setSongMessage(Math.round(uploadInfo.total * 100) + "%");
      });
      await sdk.disconnect();
      setUploading(false);

      return 1;
    } catch (error) {
      console.error(error);
      alert("Error uploading song");
      setUploading(false);
    }
  }

  async function cancelUpload() {
    await sdk.cancel();
    setUploading(false);
    setSongMessage("");
    return;
  }

  async function getDownload(data: any) {
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

  return (
    <div
      className={` items-center justify-between p-6 overflow-hidden text-sm sm:text-lg text-center sm:text-left transition-shadow bg-white shadow-sm  text-tan-700 rounded-xl hover:shadow-md`}
    >
      <div className="flex flex-row items-center ">
        <div className="relative mr-4 overflow-hidden rounded-lg w-14 h-14 sm:w-28 sm:h-28 shrink-0 md:mr-4">
          <Link passHref={true} href={`/library/album/${songData.album.id}`}>
            <Image
              quality={80}
              layout="fill"
              className="cursor-pointer"
              src={songData.album.image}
              alt={"Album Art for " + songData.album.title}
            />
          </Link>
        </div>
        <div className="">
          <div className="font-semibold">{songData.title}</div>
          <div className="font-medium">{songData.artist.name}</div>
          <div className="font-normal ">{songData.album.title}</div>
          <div className="flex justify-center gap-4 mt-2 sm:justify-start">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: songData.innerColor }}
            ></div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: songData.outerColor }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-6 BOTTOM">
        {uploading ? songMessage : null}
        <button
          onClick={upload}
          className="w-full p-1 px-2 font-semibold text-white transition-transform rounded-lg bg-tan-400 hover:shadow-md"
        >
          UPLOAD
        </button>
        <button
          onClick={cancelUpload}
          className="w-full p-1 px-2 font-semibold text-white transition-transform rounded-lg bg-tan-400 hover:shadow-md"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
