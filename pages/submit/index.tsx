import { prisma } from "@prisma/client";
import { getSession, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import Status from "../../components/Submit/Status";
import Submit from "../../components/Submit/Submit";
import { getPrismaPool } from "../../server_helpers/prismaPool";

export default function SubmitPage({ session, songs, queuePosition }: any) {
  const [viewId, setViewId] = useState("");

  useEffect(() => {
    window.localStorage.setItem("viewId", "TEST");
  }, [viewId]);

  useEffect(() => {
    console.log(songs);
  }, []);

  const printViewId = () => {
    console.log(viewId);
  };

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
            You need to be logged in to submit a song
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

  return (
    <>
      {head}
      {viewId != songs[0].id && songs[0].complete ? (
        <Submit />
      ) : (
        <Status song={songs[0]} queuePosition={queuePosition}></Status>
      )}
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
    take: 1,
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
