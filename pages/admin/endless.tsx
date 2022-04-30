import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

function createId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function EndlessUploaderPage() {
  const [data, setData] = useState({
    id: createId(),
    title: "",
    artist: {
      id: "2h93pZq0e7k5yf4dywlkpM",
      name: "Frank Ocean",
    },
    album: {
      id: "endless",
      title: "Endless",
      image: "https://i.imgur.com/eqAlMEC.jpeg",
    },
    popularity: 92,
    trackNum: 0 as number,
    previewUrl: null,
    bpm: 0 as number,
    slug: "endless/",
  });

  const submit = async () => {
    console.log(data);
    const response = await fetch("/api/tickets/custom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      }),
    });

    const result = await response.json();
    console.log(result);
    setData({
      id: createId(),
      title: "",
      artist: {
        id: "2h93pZq0e7k5yf4dywlkpM",
        name: "Frank Ocean",
      },
      album: {
        id: "endless",
        title: "Endless",
        image: "https://i.imgur.com/eqAlMEC.jpeg",
      },
      popularity: 92,
      trackNum: 0 as number,
      previewUrl: null,
      bpm: 0 as number,
      slug: "endless/",
    });
  };

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>Endless Uploader</div>
      <div className="flex flex-col gap-4 p-8 m-auto rounded-2xl max-w-prose bg-tan-100 ">
        <label className="mr-8">Title</label>
        <input
          className="p-2 rounded"
          value={data.title}
          onChange={(event) =>
            setData({
              ...data,
              title: event.target.value,
            })
          }
        ></input>

        <label className="mr-8">Slug</label>
        <input
          className="p-2 rounded"
          value={data.slug}
          onChange={(event) =>
            setData({
              ...data,
              slug: event.target.value,
            })
          }
        ></input>

        <label className="mr-8">Track Num</label>
        <input
          className="p-2 rounded"
          value={data.trackNum}
          type="number"
          onChange={(event) =>
            setData({
              ...data,
              trackNum: parseInt(event.target.value),
            })
          }
        ></input>

        <label className="mr-8">BPM</label>
        <input
          className="p-2 rounded"
          value={data.bpm}
          type="number"
          onChange={(event) =>
            setData({
              ...data,
              bpm: parseInt(event.target.value),
            })
          }
        ></input>

        <button
          className="p-2 font-semibold text-white rounded bg-tan-400"
          onClick={submit}
        >
          SUBMIT
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  console.log(session);
  if (!session || session.user.level < 3) {
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
