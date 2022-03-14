import { ReactElement, useEffect } from "react";
import { getPrismaPool } from "../../server_helpers/prismaPool";
import LibraryLayout, {
  queueContext,
} from "../../components/layouts/LibraryLayout";
import Head from "next/head";
import Song from "../../components/Songs/Song";

function Home({ songs }: any) {
  useEffect(() => {
    console.log(songs);
  }, [songs]);

  const songComponents = songs.map((song: any) => (
    <Song data={song} key={song.id} />
  ));

  return (
    <div>
      <Head>
        <title>LIBRARY</title>
      </Head>
      <div className="mx-auto text-2xl font-bold text-center ">LIBRARY</div>

      <div className="grid items-stretch gap-4 p-3 lg:grid-cols-3 sm:grid-cols-2 justify-items-stretch sm:p-9 ">
        {songComponents}
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  console.log("layout loaded");
  return (
    <LibraryLayout>
      <Home {...page.props} />
    </LibraryLayout>
  );
};

export default Home;

export async function getStaticProps({ req, res }: any) {
  const prisma = getPrismaPool();
  const songs = await prisma.song.findMany({
    where: {
      complete: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      album: true,
      artist: true,
    },
  });

  return {
    props: {
      songs,
    },
    revalidate: 1,
  };
}
