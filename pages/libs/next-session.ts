import { IncomingMessage, ServerResponse } from "http";
import * as iron from "iron-session";

export interface SessionDataType {
  [index: string]: string | number;
}

export interface SessionType {
  data: SessionDataType;
}

export const getSession = async (
  req: IncomingMessage | Request,
  res: Response | ServerResponse<IncomingMessage>
) => {
  return await iron.getIronSession<SessionType>(req, res, {
    password: "k6y934r4HJCAuwJC61HNk6y934r4HJCAuwJC61HN",
    cookieName: "default",
    cookieOptions: {
      httpOnly: true,
      secure: false,
      path: "/",
    },
  });
};

export const getSessionData = (
  session: iron.IronSession<SessionType>,
  key: string
) => {
  if (!session.data) return null;
  else {
    if (Object.keys(session.data).includes(key)) return session.data[key];
    else return null;
  }
};
