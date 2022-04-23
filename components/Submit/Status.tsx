import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSmog } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Head from "next/head";
import BigSong from "../Songs/BigSong";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import QueueSong from "../Songs/QueueSong";
import StatusSong from "../Songs/StatusSong";

export default function Status({ song, queuePosition, submitAnother }: any) {
  useEffect(() => {
    console.log("THIS IS THE SONGS", song);
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <Link href="/">
          <div className="m-5 cursor-pointer">
            <FontAwesomeIcon size="lg" icon={faHouse} />
          </div>
        </Link>
      </div>
      <div className="text-xl font-semibold text-center">STATUS</div>
      <div className="flex flex-col items-center gap-4 p-4 text-center sm:p-9 PAGE">
        <StatusSong songData={song} width="auto" />
        <div>{"You are in queue position " + queuePosition}</div>
      </div>
    </div>
  );
}
