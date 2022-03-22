import { ReactElement, useEffect, useRef, useState } from "react";
import LibraryLayout from "../../components/layouts/LibraryLayout";
import Head from "next/head";
import SongContainer from "../../components/LibraryContainers/SongContainer";
import { PropagateLoader } from "react-spinners";

import { getPrismaPool } from "../../server_helpers/prismaPool";
import PageSwitcher from "../../components/PageSwitcher";
import LibraryQueryControls from "../../components/LibraryQueryControls";
import AlbumContainer from "../../components/Albums/AlbumContainer";
import ArtistContainer from "../../components/LibraryContainers/ArtistContainer";

function Home({ initialData }: any) {
  const [data, setData] = useState(initialData);
  const [fetching, setFetching] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [fetchConfig, setFetchConfig] = useState({
    limit: 60,
    page: 1,
    fetchType: "songs",
    sort: "date",
    query: "",
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
      let response: any;
      if (fetchConfig.query.length > 0) {
        console.log("SEARCHING WITH ", fetchConfig.query);
        response = await fetch(
          `/api/${fetchConfig.fetchType}/search/?` +
            new URLSearchParams({
              page: fetchConfig.page.toString(),
              limit: limit.toString(),
              query: fetchConfig.query,
            })
        );
      } else {
        response = await fetch(
          `/api/${fetchConfig.fetchType}/?` +
            new URLSearchParams({
              page: fetchConfig.page.toString(),
              limit: limit.toString(),
              sort: fetchConfig.sort,
            })
        );
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

  let fetchContainer: ReactElement;
  if (fetchConfig.fetchType === "songs") {
    fetchContainer = <SongContainer data={data} />;
  } else if (fetchConfig.fetchType === "albums") {
    fetchContainer = <AlbumContainer data={data} />;
  } else if (fetchConfig.fetchType === "artists") {
    fetchContainer = <ArtistContainer data={data} />;
  } else {
    fetchContainer = <div>No data</div>;
  }

  return (
    <div>
      <Head>
        <title>LIBRARY</title>
      </Head>
      <div className="mx-auto text-xl font-bold text-center">LIBRARY</div>

      <div className="p-3 pt-0 sm:p-9 ">
        <LibraryQueryControls config={fetchConfig} setConfig={setFetchConfig} />
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
          <div ref={ref}>{fetchContainer}</div>
        )}
        <PageSwitcher
          search={fetchConfig.query}
          page={fetchConfig.page}
          setPage={setPage}
        />
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
