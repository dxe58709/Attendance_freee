import type { GetServerSideProps } from "next";
import { getSession } from "@/pages/libs/next-session";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (session.data && Object.keys(session.data).includes("id")) {
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
