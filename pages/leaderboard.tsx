import Head from "next/head";
import HomeButton from "../components/HomeButton";
import { getPrismaPool } from "../server_helpers/prismaPool";

export default function Leaderboard({ average, total }: any) {
  const averageElements = average.map((element: any, index: number) => (
    <div key={element.name} className="flex justify-between gap-5">
      <div>
        {index + 1}. {element.name}
      </div>
      <div>{element.downloads}</div>
    </div>
  ));
  const totalElements = total.map((element: any, index: number) => (
    <div key={element.name} className="flex justify-between gap-5">
      <div>
        {index + 1}. {element.name}
      </div>
      <div>{element.downloads}</div>
    </div>
  ));

  return (
    <>
      <Head>
        <title>Leaderboard</title>
      </Head>
      <HomeButton />
      <div className="mb-6 text-xl font-bold text-center">Leaderboards</div>
      <div className="flex flex-col items-center justify-around sm:flex-row">
        <div className="p-5 bg-tan-100 rounded-xl">
          <div className="mb-3 font-bold text-center">Average Downloads</div>
          {averageElements}
        </div>
        <div className="p-5 bg-tan-100 rounded-xl">
          <div className="mb-3 font-bold text-center">Total Downloads</div>
          {totalElements}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ req, res }: any) {
  const client = await getPrismaPool();

  // Group songs by user and count downloads
  const averageUsers = await client.song.groupBy({
    by: ["userId"],
    _avg: {
      downloads: true,
    },
    where: {
      complete: true,
    },
    orderBy: {
      _avg: {
        downloads: "desc",
      },
    },

    take: 20,
  });

  console.log(averageUsers);

  let averageFixed: any = [];

  for (let i = 0; i < averageUsers.length; i++) {
    let user = averageUsers[i];
    if (!user.userId) {
      continue;
    }
    let userData = await client.user.findFirst({
      where: {
        id: user.userId,
      },
      select: {
        name: true,
      },
    });

    averageFixed.push({
      name: userData?.name,
      downloads: user._avg.downloads!.toFixed(1),
    });
  }

  const totalUsers = await client.song.groupBy({
    by: ["userId"],
    _sum: {
      downloads: true,
    },
    where: {
      complete: true,
    },
    orderBy: {
      _sum: {
        downloads: "desc",
      },
    },

    take: 20,
  });

  let totalFixed: any = [];

  for (let i = 0; i < totalUsers.length; i++) {
    let user = totalUsers[i];
    if (!user.userId) {
      continue;
    }
    let userData = await client.user.findFirst({
      where: {
        id: user.userId,
      },
      select: {
        name: true,
      },
    });

    totalFixed.push({
      name: userData?.name,
      downloads: user._sum.downloads,
    });
  }

  return {
    props: {
      average: averageFixed,
      total: totalFixed,
    },
    revalidate: 1000,
  };
}
