import { getSession } from "next-auth/react";

export default function AdminIndex() {
  return (
    <div>
      <h1>Admin</h1>
    </div>
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
