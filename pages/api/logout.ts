import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/pages/libs/next-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const session = await getSession(req, res);
    session.data = {};
    await session.save();
  }
  res.redirect("/login");
}
