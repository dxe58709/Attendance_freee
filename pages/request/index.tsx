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
    <div className="bg-sky-100 min-h-[100vh]">
      <h2>You Logged in as {props.username} !!</h2>
      <div>
        <div className="items-center justify-center mb-[30px]">
          <div className="flex justify-center items-center">
            <div className="text-center w-[650px] border-2 border-blue-700 bg-white p-[15px]">
              <table align="center" width={600} bgcolor="white" border={2}>
                <thead>
                  <tr>
                    <th scope="col">日付</th>
                    <th scope="col">出勤</th>
                    <th scope="col">退勤</th>
                    <th scope="col">休憩</th>
                    <th scope="col">戻り</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{props.username}</th>
                    <th>{props.username}</th>
                    <th>{props.username}</th>
                    <th>{props.username}</th>
                    <th>{props.username}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <form action="/api/request" method="post">
              <button
                className="mt-10 inline-block w-[180px] h-[50px] rounded-full shadow-md bg-teal-500"
                type="submit"
              >
                <p className="text-white">確認</p>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
