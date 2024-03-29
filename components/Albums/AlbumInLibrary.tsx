import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
export default function AlbumInLibrary({ data, limit }: any) {
  useEffect(() => {
    console.log(data);
  });
  if (!data) {
    return <div>No data</div>;
  }
  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden sm:w-12 sm:h-12 shrink-0 rounded-xl sm:mr-4">
          {data.image && (
            <Image
              layout="fill"
              quality={40}
              className="cursor-pointer"
              src={data.image}
              alt={"Album Art for " + data.title}
            />
          )}
        </div>
        <div className="text-black truncate shrink">
          <Link href={`/library/album/${data.id}`} passHref={true}>
            <a className="font-semibold truncate hover:underline text-ellipsis">
              {data.title}
            </a>
          </Link>
          <Link href={`/library/artist/${data.artist.id}`} passHref={true}>
            <a className="block font-medium cursor-pointer hover:underline">
              {data.artist.name}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
