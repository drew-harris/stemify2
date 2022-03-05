import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <div className="mx-auto mb-4 text-center text-neutral-800 font-bold  text-[28px] mt-32">
        STEMIFY 2
      </div>
      <div className="flex flex-col items-center justify-center gap-4 pt-8 mx-auto mb-10">
        <Link href="/submit">
          <a className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0">
            SUBMIT
          </a>
        </Link>
        <Link href="/queue">
          <a className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0">
            QUEUE
          </a>
        </Link>
        <Link href="/test">
          <a className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0">
            TEST
          </a>
        </Link>
      </div>
    </>
  );
};

export default Home;
