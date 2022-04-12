import config from "../config";
import Countdown from "react-countdown";
import Head from "next/head";

export default function Closed() {
  return (
    <div className="grid h-screen text-2xl place-items-center">
      <Head>
        <title>STEMIFY</title>
      </Head>
      <div className="flex flex-col items-center font-semibold gap-14">
        STEMIFY
        <br />
        COMING SOON
        {/* <Countdown
          date={config.releaseDate + 3000}
          onComplete={() => location.reload()}
        /> */}
      </div>
    </div>
  );
}
