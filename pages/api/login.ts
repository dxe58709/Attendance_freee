import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/pages/libs/prisma";
import { getSession } from "@/pages/libs/next-session";

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
        if (!session.data) session.data = {};
        console.log(session.data);
        session.data = Object.assign(session.data, {
          id: find[0].id,
          username: find[0].username,
        });
      }
      await session.save();
      await prisma.$disconnect();
      res.send(`
      <script>
        window.location.href="/login"
      </script>
      `);
      return;
    }
  }
  res.redirect("/");
}
