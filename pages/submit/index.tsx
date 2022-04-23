import { faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import StatusSong from "../../components/Songs/StatusSong";
import { getPrismaPool } from "../../server_helpers/prismaPool";
import config from "../../config";

const SubmitNewSongButton = ({ songs, position }: any) => {
  function numSongsInQueue() {
    return songs.filter((song: any) => song.complete === false).length;
  }

  if (numSongsInQueue() < config.maxSubmitedSongs) {
    return (
      <Link href="/submit/new" passHref={true}>
        <div className="p-3 cursor-pointer rounded-xl hover:shadow-md bg-tan-100">
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </div>
      </Link>
    );
  }

  function getNumSuffix(number: number) {
    if (number === 1) {
      return "st";
    } else if (number === 2) {
      return "nd";
    } else if (number === 3) {
      return "rd";
    } else {
      return "th";
    }
  }

  return (
    <div className="p-3 rounded-xl hover:shadow-md bg-tan-100">
      {`You are ${position}${getNumSuffix(position)} in queue`}
    </div>
  );
};

export default function SubmitPage({ session, songs, queuePosition }: any) {
  const head = (
    <Head>
      <title>SUBMIT</title>
    </Head>
  );

  if (!session?.user) {
    return (
      <>
        {head}
        <div className="flex flex-col items-center justify-center gap-5 p-3 mx-auto m-9 ">
          <div className="text-lg font-bold text-center m-9">
            You need to be logged in to submit songs
          </div>
          <button
            className="p-1 px-2 ml-2 font-semibold text-white transition-transform rounded bg-tan-500 hover:shadow-md hover:scale-105 "
            onClick={() => signIn("discord")}
          >
            SIGN IN WITH DISCORD
          </button>
        </div>
      </>
    );
  }

  const songElements = songs.map((song: any) => (
    <StatusSong songData={song} key={song.id} />
  ));

  return (
    <>
      {head}
      <div>
        <div className="flex justify-between">
          <Link href="/">
            <div className="m-5 cursor-pointer">
              <FontAwesomeIcon size="lg" icon={faHouse} />
            </div>
          </Link>
        </div>
        <div className="text-xl font-semibold text-center">Your Songs</div>
        <div className="flex flex-col items-stretch max-w-lg gap-2 p-4 m-auto text-center sm:p-9 PAGE">
          <SubmitNewSongButton songs={songs} position={queuePosition} />
          {songElements}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  if (!session?.user) {
    return {
      props: {
        session: null,
        songs: null,
      },
    };
  }

  console.log(session.user);
  const client = getPrismaPool();
  const songs = await client.song.findMany({
    where: {
      user: {
        id: session.user.id,
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      title: true,
      artist: true,
      album: true,
      previewUrl: true,
      submittedAt: true,
      complete: true,
    },
  });

  let queuePosition = 0;

  if (!songs[0].complete) {
    //count songs submitted before this one
    const count = await client.song.count({
      where: {
        submittedAt: {
          lt: songs[0].submittedAt,
        },
        complete: false,
      },
    });

    queuePosition = count + 1;
  }

  console.log(songs);

  return {
    props: {
      session,
      songs,
      queuePosition,
    },
  };
}
