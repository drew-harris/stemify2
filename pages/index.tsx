import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { userInfo } from "os";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: session }: any = useSession();
  useEffect(() => {
    console.log(session);
  });

  return (
    <>
      <Head>
        <title>STEMIFY</title>
      </Head>
      <div className="mx-auto mb-4 text-center text-neutral-800 font-bold  text-[28px] mt-32">
        STEMIFY
      </div>
      <div className="flex flex-col items-center justify-center gap-4 pt-8 mx-auto mb-10">
        <Link href="/submit">
          <a className="text-xl font-bold underline text-neutral-800 sm:mb-0">
            SUBMIT
          </a>
        </Link>
        <Link href="/library">
          <a className="text-xl font-bold underline text-neutral-800 sm:mb-0">
            LIBRARY
          </a>
        </Link>
        <Link href="/queue">
          <a className="text-xl font-bold underline text-neutral-800 sm:mb-0">
            QUEUE
          </a>
        </Link>

        {session?.user?.level > 0 && (
          <Link href="/admin">
            <a className="text-xl font-bold underline text-neutral-800 sm:mb-0">
              ADMIN
            </a>
          </Link>
        )}
        {session?.user ? (
          <button
            onClick={() => signOut()}
            className="text-xl font-bold underline text-neutral-800 sm:mb-0"
          >
            SIGN OUT
          </button>
        ) : (
          <button
            onClick={() => signIn("discord")}
            className="text-xl font-bold underline text-neutral-800 sm:mb-0"
          >
            SIGN IN
          </button>
        )}
      </div>
      <div className="fixed underline bottom-2 left-2">
        <a href="https://www.buymeacoffee.com/stemify">Donate</a>
      </div>
    </>
  );
};

export default Home;
