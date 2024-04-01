import type { GetServerSideProps } from "next";
import { format } from 'date-fns'
import { getSession, getSessionData } from "@/pages/libs/next-session";
import prisma from "@/pages/libs/prisma";

type Props = {
  id: number;
  username: string;
  date: string;
  arrive?: string | null;
  leave?: string | null;
  break?: string | null;
  back?: string | null;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (req.method == "POST") {
    if (getSessionData(session, "id")) {
      await prisma.$connect();
      let date = new Date();
      date.setTime(date.getTime() + 1000 * 60 * 60 * 9);
      let find = await prisma.attendance.findMany({
        where: {
          username: String(getSessionData(session, "username")),
          date: date.getDate().toString(),
        },
        orderBy: {
          time: 'desc'
        }
      });
      console.log(find)
      let _arrive = find.find((v) => v.type == "arrive");
      let _leave = find.find((v) => v.type == "leave");
      let _break = find.find((v) => v.type == "break");
      let _back = find.find((v) => v.type == "back");
      let props: Props = {
        id: Number(session.data.id),
        username: String(session.data.username),
        date: date.getDate().toString(),
        arrive: _arrive && _arrive.time ? _arrive.time : null,
        leave: _leave && _leave.time ? _leave.time : null,
        break: _break && _break.time ? _break.time : null,
        back: _back && _back.time ? _back.time : null,
      };
      await prisma.$disconnect();
      return { props: props };
    }
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
    <div className="bg-sky-100 min-h-[100vh] text-black">
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
                    <th scope="row">{props.arrive ? format(Date.now(), "yyyy/MM/dd") : null}</th>
                    <th suppressHydrationWarning={true}>{props.arrive ? format(new Date(Number(props.arrive) - 1000 * 60 * 60 * 9), "HH:mm") : null}</th>
                    <th suppressHydrationWarning={true}>{props.leave ? format(new Date(Number(props.leave) - 1000 * 60 * 60 * 9), "HH:mm") : null}</th>
                    <th suppressHydrationWarning={true}>{props.break ? format(new Date(Number(props.break) - 1000 * 60 * 60 * 9), "HH:mm") : null}</th>
                    <th suppressHydrationWarning={true}>{props.back ? format(new Date(Number(props.back) - 1000 * 60 * 60 * 9), "HH:mm") : null}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <form action="/logout" method="post">
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
