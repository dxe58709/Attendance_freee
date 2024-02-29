import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/pages/libs/next-session";
import prisma from "@/pages/libs/prisma";

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
        session.data = { id: find[0].id, username: find[0].username };
        await session.commit();
      }
      await prisma.$disconnect();
      res.redirect("/login");
      return;
    }
  }
  res.redirect("/");
}
