import Image from "next/image";
import Link from "next/link";

export default function StatusSong({ songData, width = 96 }: any) {
  return (
    <div
      className={`flex flex-row items-center justify-between p-2  overflow-hidden   text-left transition-shadow bg-white shadow-sm  text-tan-700 rounded-xl hover:shadow-md`}
    >
      <div className="flex flex-row items-center ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden rounded-lg sm:w-10 sm:h-10 shrink-0 ">
          <Image
            quality={30}
            layout="fill"
            src={songData.album.image}
            alt={"Album Art for " + songData.album.title}
          />
        </div>
        <div className="">
          <div className="font-semibold">{songData.title}</div>
          <div className="font-medium">{songData.artist.name}</div>
        </div>
      </div>
      {songData.complete ? (
        <Link href={`/song/${songData.id}`} passHref={true}>
          <button className="hidden p-1 px-2 ml-2 font-semibold text-white transition-transform rounded bg-tan-400 sm:block hover:shadow-md hover:scale-105 ">
            VIEW
          </button>
        </Link>
      ) : (
        <div className="font-semibold text-tan-400">In Queue</div>
      )}
    </div>
  );
}
