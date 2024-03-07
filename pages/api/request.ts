import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/pages/libs/prisma";
import { getSession, getSessionData } from "@/pages/libs/next-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const session = await getSession(req, res);
    if (getSessionData(session, "username")){
      await prisma.$connect();
      // let find = await prisma.attendance.findMany({
      //   where: {
      //     username: String(req.body.username),
      //     username: String(getSessionData(session, "username")),
      //     date: date.getDate().toString(),
      //     type: 
      //     time: date.getTime().toString()
      //   },
      // });
      // if (find.length > 0) {
      //   if (!session.data) session.data = {};
      //   session.data = Object.assign(session.data, {
      //     id: find[0].id,
      //     username: find[0].username,
      //   });
      // }
      await prisma.$disconnect();
      res.redirect("/logout");
      return;
    }
  }
  res.redirect("/");
}