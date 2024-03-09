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

export default function Page(props: Props) {
  return (
    <div className="bg-sky-100">
      <h2>You Logged in as {props.username} !!</h2>
      <div className="flex justify-center items-center h-[100vh]">
        <div className="text-center">
          <h2>ログアウトしますか？</h2>
          <div className="flex justify-center items-center gap-[20px]">
          <form action="/api/logout" method="post">
            <button className="inline-block w-[180px] h-[50px] rounded shadow-md bg-blue-700" type="submit">
              <p className="text-white">ログアウト</p>
            </button>
          </form>
          <form action="/attendance" method="post">
            <button className="inline-block w-[180px] h-[50px] rounded shadow-md bg-blue-700" type="submit">
              <p className="text-white">戻る</p>
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
