import { ReactElement, useEffect, useState } from "react";
import LibraryLayout from "../../components/layouts/LibraryLayout";
import Head from "next/head";
import SongContainer from "../../components/LibraryContainers/SongContainer";

import { getPrismaPool } from "../../server_helpers/prismaPool";

function Home({ initialData }: any) {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <Head>
        <title>LIBRARY</title>
      </Head>
      <div className="mx-auto text-2xl font-bold text-center ">LIBRARY</div>
      <SongContainer data={data} />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <LibraryLayout>
      <Home {...page.props} />
    </LibraryLayout>
  );
};

export default Home;

export async function getStaticProps({ req, res }: any) {
  const prisma = getPrismaPool();
  const initialData = await prisma.song.findMany({
    where: {
      complete: true,
    },
    take: 60,
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
      initialData,
    },
    revalidate: 100,
  };
}
