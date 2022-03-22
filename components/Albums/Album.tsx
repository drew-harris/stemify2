import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import WideSong from "../Songs/WideSong";

export function Album({ album, embedded = false }: any) {
  const songs = album?.songs;
  const songComponents = songs?.map((song: any) => {
    song.album = {
      image: album.image,
    };
    return <WideSong showTrackNumber={true} data={song} key={song.id} />;
  });
  useEffect(() => {
    console.log(album);
  }, [album]);
  if (!album || !album.image) {
    return null;
  }
  let imageClass: string;
  if (!embedded) {
    imageClass =
      "relative w-8 h-8 mr-2 overflow-hidden rounded-md sm:w-32 sm:h-32 shrink-0 sm:mr-4";
  } else {
    imageClass =
      "relative w-8 h-8 mr-2 overflow-hidden rounded-md sm:w-16 sm:h-16 shrink-0 sm:mr-4";
  }
  return (
    <div className={embedded ? "mb-8" : ""}>
      <div className="flex items-end info">
        <div className={imageClass}>
          <Image
            layout="fill"
            quality={40}
            className="cursor-pointer"
            src={album.image}
            alt={"Album Art for " + album.title}
          />
        </div>
        <div className="flex items-end justify-between grow">
          <div>
            <div
              className={
                !embedded
                  ? "text-4xl font-semibold info"
                  : "text-xl font-semibold info"
              }
            >
              {album.title}
            </div>

            {!embedded ? (
              <div className="flex gap-2">
                <div className="relative w-8 h-8 overflow-hidden rounded-full sm:w-6 sm:h-6 shrink-0 ">
                  <Image
                    layout="fill"
                    quality={40}
                    className="cursor-pointer"
                    src={album.artist.image}
                    alt={"Album Art for " + album.title}
                  />
                </div>
                <Link
                  passHref={true}
                  href={`/library/artist/${album.artist.id}`}
                >
                  <a className="text-xl font-semibold cursor-pointer info hover:underline">
                    {album.artist.name}
                  </a>
                </Link>
              </div>
            ) : (
              <div />
            )}
          </div>
          <button className="hidden h-[0%] p-1 px-2 font-semibold text-white transition-transform rounded-md shrink-1 bg-tan-400 sm:block hover:shadow-md hover:scale-105">
            ADD ALL
          </button>
        </div>
      </div>
      <div className="mt-4 bg-white rounded-md">{songComponents}</div>
    </div>
  );
}
