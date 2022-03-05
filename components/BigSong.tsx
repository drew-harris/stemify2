import Image from "next/image";
import { usePalette } from "react-palette";
import { useEffect, useState } from "react";

export default function BigSong({ songData, setColors, width = "96" }: any) {
  const { data, loading, error } = usePalette(songData.metadata.albumArt);
  return (
    <div
      className={`flex flex-row items-center justify-between p-4 overflow-hidden sm:text-lg text-center sm:text-left transition-shadow bg-white shadow-sm md:w-${width} text-tan-700 rounded-xl hover:shadow-md`}
    >
      <div className="flex flex-row items-center ">
        <div className="relative w-0 h-0 mr-0 overflow-hidden rounded-lg sm:w-28 sm:h-28 shrink-0 sm:mr-4">
          <Image
            layout="fill"
            src={songData.metadata.albumArt}
            alt={"Album Art for " + songData.metadata.albumTitle}
          />
        </div>
        <div className="" style={{ color: data.darkMuted }}>
          <div className="font-semibold">{songData.title}</div>
          <div className="font-medium">{songData.metadata.artist}</div>
          <div className="font-normal ">{songData.metadata.albumTitle}</div>
          <div className="flex justify-center gap-4 mt-2 sm:justify-start">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.vibrant }}
            ></div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.darkVibrant }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
