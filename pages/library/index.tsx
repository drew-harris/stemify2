import { useEffect } from "react";
import { getPrismaPool } from "../../server_helpers/prismaPool";
import LibraryLayout, {
  queueContext,
} from "../../components/layouts/LibraryLayout";
import Song from "../../components/Song";

export default function Home({ songs }: any) {
  useEffect(() => {
    console.log(songs);
  }, [songs]);

  const songComponents = songs.map((song: any) => (
    <Song data={song} key={song.id} />
  ));

  return (
    <>
      <div className="mx-auto text-2xl font-bold text-center ">LIBRARY</div>

      <div className="grid items-stretch gap-4 p-3 lg:grid-cols-3 sm:grid-cols-2 justify-items-stretch sm:p-9 ">
        {songComponents}
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: any) {
  console.log("layout loaded");
  return (
    <LibraryLayout>
      <Home {...page.props} />
    </LibraryLayout>
  );
};

export async function getServerSideProps({ req, res }: any) {
  const prisma = getPrismaPool();
  const songs = await prisma.song.findMany({
    where: {
      complete: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      metadata: true,
    },
  });

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=900, stale-while-revalidate=59"
  );
  return {
    props: {
      songs,
    },
  };
}
