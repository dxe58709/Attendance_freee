import { GetServerSideProps } from "next";
import nextSession from "next-session";

const getSession = nextSession({
  autoCommit: false,
  cookie: {
    maxAge: 86400,
  },
});

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  var session = await getSession(req, res);

  /**
   * If alraedy loggedin,
   * - redirect to `/attendance`
   * - inheriting session data
   * - renew session
   */
  if (session.data && session.data.userId) {
    let data = session.data;
    session.destroy();
    var session = await getSession(req, res);
    session.data = data;
    session.commit();
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
        <input type="text" name="username" id="username" />
        <input type="password" name="password" id="password" />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
