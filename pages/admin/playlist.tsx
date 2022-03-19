import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HomeButton from "../../components/HomeButton";

import Image from "next/image";
import Link from "next/link";

import { PulseLoader } from "react-spinners";
import Head from "next/head";

function PlaylistSong({ url }: any) {
  const [data, setData] = useState(null) as any;
  const [submitLoad, setSubmitLoad] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getData = async (url: any) => {
    const response = await fetch("/api/youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url, limit: 1 }),
    });
    const data = await response.json();
    setData(data[0]);
  };

  useEffect(() => {
    getData(url);
  }, []);

  const submitSong = async () => {
    console.log("Submitting song");
    setSubmitLoad(true);
    const response: any = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        data,
      }),
    });
    if (response.status === 200 || response.status === 303) {
      setSubmitLoad(false);
      setSubmitted(true);
    }
    const responseData = await response.json();
    console.log(responseData);
  };

  if (!data) {
    return (
      <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center truncate text-ellipsis ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden sm:w-12 sm:h-12 shrink-0 rounded-2xl sm:mr-4">
          {data.album.image && data.album.title ? (
            <Image
              layout="fill"
              quality={40}
              className="cursor-pointer"
              src={data.album.image}
              alt={"Album Art for " + data.album.title}
            />
          ) : null}
        </div>
        <div className="text-black truncate shrink">
          <Link href={`/song/${data.id}`} passHref={true}>
            <a className="font-semibold truncate text-ellipsis">{data.title}</a>
          </Link>
          <div className="font-medium">{data.artist.name}</div>
        </div>
      </div>
      {submitLoad ? (
        <PulseLoader size={4} color="#544738" loading={submitLoad} />
      ) : (
        <button
          onClick={submitSong}
          className="p-1 px-2 ml-2 font-semibold text-white transition-transform rounded-xl bg-tan-500 hover:shadow-md hover:scale-105 "
        >
          {submitted ? "DONE" : "SUBMIT"}
        </button>
      )}
    </div>
  );
}

export default function AdminIndex() {
  const [playlistLink, setPlaylistLink] = useState("");
  const [urls, setUrls] = useState([]);

  const getUrls = async (url: string) => {
    try {
      const response = await fetch("/api/youtube/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url, limit: 1 }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setUrls(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const playlistSongComponents = urls.map((url: string) => (
    <PlaylistSong url={url} key={url} />
  ));

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <HomeButton></HomeButton>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold text-center ">PLAYLIST UPLOAD</h1>
        <div>
          <input
            type="text"
            value={playlistLink}
            onChange={(e) => setPlaylistLink(e.target.value)}
            className="px-3 py-1 disabled:bg-white text-black transition-shadow shadow-sm w-auto text-center sm:w-[26rem] accent-tan-500 rounded-xl focus:shadow-lg border-tan-500 placeholder:text-tan-200"
          ></input>
          <button
            onClick={() => getUrls(playlistLink)}
            className="p-1 px-2 ml-2 font-semibold text-white transition-transform rounded-xl bg-tan-500 hover:shadow-md hover:scale-105 "
          >
            SUBMIT
          </button>
          <div className="flex flex-col gap-4 m-5">
            {playlistSongComponents}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  console.log(session);
  if (!session || session.user.level < 1) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return { props: {} };
  }
  return {
    props: {
      session,
    },
  };
}
