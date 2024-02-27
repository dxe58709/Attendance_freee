import type { NextApiRequest, NextApiResponse } from "next";
import nextSession from "next-session";
import prisma from "@/pages/libs/prisma";

const getSession = nextSession({ autoCommit: false });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const session = await getSession(req, res);
    if (req.body.username && req.body.password) {
      await prisma.$connect();
      let find = await prisma.users.findMany({
        where: {
          username: String(req.body.username),
          password: String(req.body.password),
        },
      });
      if (find.length > 0) {
        session.data.id = find[0].id;
        await session.commit();
      }
      await prisma.$disconnect();
      res.redirect("/login");
    }
  }
  res.redirect("/");
}
