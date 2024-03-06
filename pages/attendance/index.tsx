import { getSession, getSessionData } from "@/pages/libs/next-session";
import { GetServerSideProps } from "next";
import prisma from "../libs/prisma";
import { useState, useEffect } from 'react';

type Props = {
  id: number;
  username: string;
  isArrived: boolean;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  if (getSessionData(session, "id")) {
    let date = new Date();
    date.setTime(date.getTime() + 1000 * 60 * 60 * 9);
    let findArrive = await prisma.attendance.findMany({
      where: {
        username: String(getSessionData(session, "username")),
        date: date.getDate().toString(),
        type: "arrive",
      },
    });
    let isArrived = findArrive.length > 0;
    let props: Props = {
      id: Number(session.data.id),
      username: String(session.data.username),
      isArrived: isArrived,
    };
    console.log("isArrived: ", props.isArrived);
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
//   const date = new Date();
//   const clientOffset = new Date().getTimezoneOffset() * 60000;
//   const clientTime = new Date(date.setTime(date.getTime() + 1000 * 60 * 60 * 9) + clientOffset);
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       clientTime.current = new Date();
// }, 1000);

//     return () => clearInterval(interval);
//   }, []);

  return (
    <div className="bg-sky-100">
      <h1>勤怠サービス</h1>
      <h2>You Logged in as {props.username} !!</h2>
        {/* <div className="text-center items-center justify-center w-[300px] h-[100px] border-y-2 border-black">
         <p className="text-black text-4xl">現在時刻</p>
         <p className="text-black text-4xl">{clientTime.current.toLocaleString("ja-JP")}</p>
        </div> */}
      <div className="flex justify-center items-center  gap-[20px] h-[100vh]">
        <form className="block" action="/api/arrive" method="post">
          <button type="submit">
            <div className="flex items-center justify-center w-[180px] h-[50px] rounded-full bg-teal-500">
              <p className="text-white">出勤</p>
            </div>
          </button>
        </form>
        <form className="block" action="/api/break" method="post">
          <button type="submit" disabled={!props.isArrived}>
            <div className="flex items-center justify-center w-[180px] h-[50px] rounded-full bg-teal-500">
              <p className="text-white">休憩</p>
            </div>
          </button>
        </form>
        <form className="block" action="/api/back" method="post">
          <button type="submit" disabled={!props.isArrived}>
            <div className="flex items-center justify-center w-[180px] h-[50px] rounded-full bg-teal-500">
              <p className="text-white">戻り</p>
            </div>
          </button>
        </form>
        <form className="block" action="/api/leave" method="post">
          <button type="submit" disabled={!props.isArrived}>
            <div className="flex items-center justify-center w-[180px] h-[50px] rounded-full bg-teal-500">
              <p className="text-white">退勤</p>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
