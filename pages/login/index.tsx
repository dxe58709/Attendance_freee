import type { GetServerSideProps } from "next";
import { getSession, getSessionData } from "@/pages/libs/next-session";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (getSessionData(session, "id")) {
    return {
      redirect: {
        destination: "/attendance",
        permanent: true,
      },
    };
  }
  return {
    props: {
      username: !!getSessionData(session, "id") ? "" : "Loggedin",
    },
  };
};

export default function Login() {
  return (
    <div>
      <form action="/api/login" method="post">
        <input
          className="block text-black"
          type="text"
          name="username"
          id="username"
          placeholder="username"
        />
        <input
          className="block text-black"
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <button className="block" type="submit">
          login
        </button>
      </form>
    </div>
  );
}
