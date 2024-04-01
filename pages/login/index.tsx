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
  return { props: {} };
};

export default function Page() {
  return (
    <div className="flex justify-center items-center h-[100vh] bg-sky-100">
      <div className="text-center text-black">
        <h2>勤怠サービスにログイン</h2>
      <form action="/api/login" method="post">
        <input
          className="block w-[180px] text-black rounded"
          type="text"
          name="username"
          id="username"
          placeholder="username"
        />
        <input
          className="block w-[180px] text-black rounded"
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <div className="text-center">
          <button className="inline-block w-[180px] h-[50px] rounded shadow-md bg-blue-700" type="submit">
            <p className="text-white">ログイン</p>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
