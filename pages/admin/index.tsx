import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import HomeButton from "../../components/HomeButton";

export default function AdminIndex() {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>
        <HomeButton />
        <h1 className="m-10 text-2xl font-bold text-center text-neutral-900 ">
          ADMIN
        </h1>
        <Link href="/admin/playlist">
          <a className="block mb-8 text-xl font-bold text-center underline sm:mb-0">
            PLAYLIST UPLOAD
          </a>
        </Link>
        <Link href="/admin/endless">
          <a className="block mb-8 text-xl font-bold text-center underline sm:mb-0">
            ENDLESS
          </a>
        </Link>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  console.log(session);
  if (!session || session.user.level < 1) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return { props: {} };
  }
  return {
    props: {
      session,
    },
  };
}
