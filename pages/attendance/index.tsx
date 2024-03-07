import { getSession, getSessionData } from "@/pages/libs/next-session";
import { GetServerSideProps } from "next";

import prisma from "@/pages/libs/prisma";
import * as NTP from "ntp-time";
import { useState, useEffect } from "react";

type Props = {
  status: boolean;
  id?: number;
  username?: string;
  isArrived?: boolean;
  tmp?: number;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (getSessionData(session, "id")) {
    const ntp = new NTP.Client("ntp.nict.jp", 123, { timeout: 500 });
    try {
      let mtime = (await ntp.syncTime()).time.getTime() + 1000 * 60 * 60 * 9;
      let date = new Date(mtime);
      let findArrive = await prisma.attendance.findMany({
        where: {
          username: String(getSessionData(session, "username")),
          date: date.getDate().toString(),
          type: "arrive",
        },
      });
      let isArrived = findArrive.length > 0;
      let props: Props = {
        status: true,
        id: Number(session.data.id),
        username: String(session.data.username),
        isArrived: isArrived,
        tmp: date.getTime(),
      };
      return { props: props };
    } catch (e) {
      console.error(e);
      let props: Props = {
        status: false,
      };
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
  const [time, setTime] = useState<Date | null>(null);
  const [hydration, setHydration] = useState(0); // Wait Server Prerender
  useEffect(() => {
    if (!hydration) {
      setTime(null);
      setHydration(1);
    } else
      setInterval(async () => {
        setTime(new Date());
      }, 1000);
  }, [time, hydration]);

  return props.status ? (
    <>
      <div className="fixed">
        <h1>勤怠サービス</h1>
        <h2>You Logged in as {props.username} !!</h2>
      </div>
      <div className="bg-sky-100 h-[100vh] flex items-center justify-center">
        <div>
          <div className="flex items-center justify-center mb-[30px]">
            <div className="text-center w-[780px] border-t-4 border-blue-700 bg-white p-[15px]">
              <p className="text-black text-4xl">現在時刻</p>
              <p id="timestamp" className="text-black text-7xl">
                {((time) => {
                  if (time) {
                    let nowHour = time.getHours();
                    let nowMin = time.getMinutes();
                    let nowSec = time.getSeconds();
                    return (
                      (nowHour < 10 ? `0${nowHour}` : nowHour) +
                      ":" +
                      (nowMin < 10 ? `0${nowMin}` : nowMin) +
                      ":" +
                      (nowSec < 10 ? `0${nowSec}` : nowSec)
                    );
                  }
                })(time)}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center  gap-[20px]">
            <form className="block" action="/api/arrive" method="post">
              <button type="submit">
                <div className="flex items-center justify-center w-[180px] h-[50px] shadow-md rounded-full bg-teal-500">
                  <p className="text-white">出勤</p>
                </div>
              </button>
            </form>
            <form className="block" action="/api/break" method="post">
              <button type="submit" disabled={!props.isArrived}>
                <div
                  className={
                    "flex items-center justify-center w-[180px] h-[50px] shadow-md rounded-full " +
                    (props.isArrived ? "bg-teal-500" : "bg-slate-500")
                  }
                >
                  <p className="text-white">休憩</p>
                </div>
              </button>
            </form>
            <form className="block" action="/api/back" method="post">
              <button type="submit" disabled={!props.isArrived}>
                <div
                  className={
                    "flex items-center justify-center w-[180px] h-[50px] shadow-md rounded-full " +
                    (props.isArrived ? "bg-teal-500" : "bg-slate-500")
                  }
                >
                  <p className="text-white">戻り</p>
                </div>
              </button>
            </form>
            <form className="block" action="/api/leave" method="post">
              <button type="submit" disabled={!props.isArrived}>
                <div
                  className={
                    "flex items-center justify-center w-[180px] h-[50px] shadow-md rounded-full " +
                    (props.isArrived ? "bg-teal-500" : "bg-slate-500")
                  }
                >
                  <p className="text-white">退勤</p>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>
      <h1>Failed to get time from ntp. Please reload this page.</h1>
    </div>
  );
}
