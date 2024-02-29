import type { GetServerSideProps, InferGetStaticPropsType } from "next";
import {getSession} from "@/pages/libs/next-session";
import { SessionProps } from "@/pages/libs/session";

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSession(req, res);
  if (session.data && Object.keys(session.data).includes("id")) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }
  return {
    props: session.data,
  };
}) satisfies GetServerSideProps<{ props: SessionProps }>;

export default function Login({
  props,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <div>
      <p>you loggedin as「{props.username}」</p>
    </div>
  );
}
