import Image from "next/image";
import { useEffect } from "react";
import { usePalette } from "react-palette";

export default function BigSong({ songData, setColors, width = 96 }: any) {
  const { data, loading, error } = usePalette(songData.album.image);

  useEffect(() => {
    if (data) {
      setColors([data.vibrant, data.darkVibrant]);
    }
  }, [data, setColors]);
  return (
    <div
      className={`flex flex-row  items-center justify-between p-4 overflow-hidden text-sm sm:text-lg text-center sm:text-left transition-shadow bg-white shadow-sm sm:w-${width} text-tan-700 rounded-xl hover:shadow-md`}
    >
      <div className="flex flex-row items-center ">
        <div className="relative mr-4 overflow-hidden rounded-lg w-14 h-14 sm:w-28 sm:h-28 shrink-0 md:mr-4">
          <Image
            quality={80}
            layout="fill"
            src={songData.album.image}
            alt={"Album Art for " + songData.album.title}
          />
        </div>
        <div className="" style={{ color: data.darkMuted }}>
          <div className="font-semibold">{songData.title}</div>
          <div className="font-medium">{songData.artist.name}</div>
          <div className="font-normal ">{songData.album.title}</div>
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
