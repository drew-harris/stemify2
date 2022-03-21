import { ReactElement, useEffect, useRef, useState } from "react";
import LibraryLayout from "../../components/layouts/LibraryLayout";
import Head from "next/head";
import SongContainer from "../../components/LibraryContainers/SongContainer";
import { PropagateLoader } from "react-spinners";

import { getPrismaPool } from "../../server_helpers/prismaPool";
import PageSwitcher from "../../components/PageSwitcher";

function Home({ initialData }: any) {
  const [data, setData] = useState(initialData);
  const [fetching, setFetching] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [fetchConfig, setFetchConfig] = useState({
    limit: 60,
    page: 1,
    fetchType: "songs",
  });

  const [height, setHeight] = useState(0);
  const ref: any = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.clientHeight) {
      setHeight(ref?.current?.clientHeight);
    }
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const updateData = async () => {
      console.log("fetching data");
      setFetching(true);
      let limit = 24;
      const response = await fetch(
        `/api/${fetchConfig.fetchType}/?` +
          new URLSearchParams({
            page: fetchConfig.page.toString(),
            limit: limit.toString(),
            sort: "date",
          })
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
        setFetching(false);
      }
    };
    if (updateCount > 0) {
      updateData();
    }
    setUpdateCount(updateCount + 1);
  }, [fetchConfig]);

  const setPage = (page: number) => {
    setFetchConfig({
      ...fetchConfig,
      page,
    });
  };

  return (
    <div>
      <Head>
        <title>LIBRARY</title>
      </Head>
      <div className="mx-auto text-xl font-bold text-center">LIBRARY</div>

      <div className="p-3 pt-0 sm:p-9 ">
        {fetching ? (
          <div
            className="flex items-center justify-center"
            style={{
              height: `${height}px`,
            }}
          >
            <PropagateLoader color={"#544738"} />
          </div>
        ) : (
          <div ref={ref}>
            <SongContainer data={data} />
          </div>
        )}
        <PageSwitcher page={fetchConfig.page} setPage={setPage} />
      </div>
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
    take: 24,
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
