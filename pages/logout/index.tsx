import type { GetServerSideProps } from "next";
import { getSession, getSessionData } from "@/pages/libs/next-session";

type Props = {
  id: number;
  username: string;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (getSessionData(session, "id")) {
    let props: Props = {
      id: Number(session.data.id),
      username: String(session.data.username),
    };
    return { props: props };
  }
  return {
    redirect: {
      destination: "/login",
      permanent: true,
    },
  };
};

export default function Login(props: Props) {
  return (
    <div>
    <h2>You Logged in as {props.username} !!</h2>
      <form action="/api/logout" method="post">
        <button className="block" type="submit">
          logout
        </button>
      </form>
    </div>
  );
}
