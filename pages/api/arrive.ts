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
      let date = new Date();
      date.setTime(date.getTime() + 1000 * 60 * 60 * 9);
      await prisma.$connect();
      await prisma.attendance.create({
        data: {
          username: String(getSessionData(session, "username")),
          date: date.getDate().toString(),
          type: "arrive",
          time: date.getTime().toString()
        },
      });
      await prisma.$disconnect();
      res.redirect("/attendance");
      return;
    }
  }
  res.redirect("/");
}
