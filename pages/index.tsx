import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  useEffect(() => {
    console.log(session);
  });

  return (
    <>
      <div className="m-8">
        {session ? "Logged In As: " + session?.user?.name : "Logged Out"}
      </div>

      <div className="mx-auto mb-4 text-center text-neutral-800 font-bold  text-[28px] mt-32">
        STEMIFY 2
      </div>
      <div className="mx-auto  text-center text-tan-500 font-bold  text-[28px] ">
        (WORK IN PROGRESS)
      </div>
      <div className="flex flex-col items-center justify-center gap-4 pt-8 mx-auto mb-10">
        <Link href="/submit">
          <a className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0">
            SUBMIT
          </a>
        </Link>
        <Link href="/library">
          <a className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0">
            LIBRARY
          </a>
        </Link>
        <Link href="/queue">
          <a className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0">
            QUEUE
          </a>
        </Link>
        <button
          onClick={() => signIn("discord")}
          className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0"
        >
          SIGN In
        </button>

        <button
          onClick={() => signOut()}
          className="mb-8 text-xl font-bold underline text-neutral-800 sm:mb-0"
        >
          SIGN OUT
        </button>
      </div>
    </>
  );
};

export default Home;
