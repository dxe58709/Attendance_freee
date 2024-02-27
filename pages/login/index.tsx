import nextSession from "next-session";
import type { GetServerSideProps } from "next";

const getSession = nextSession({ autoCommit: false });

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  var session = await getSession(req, res);
  if (session.data && Object.keys(session.data).includes("userId")) {
    return {
      redirect: {
        destination: "/attendance",
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};

export default function Login() {
  return (
    <div>
      <form action="/api/login" method="post">
        <input
          className="block"
          type="text"
          name="username"
          id="username"
          placeholder="username"
        />
        <input
          className="block"
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
