import { CommonContextProvider } from "context/Common";
import { AppSessionContextProvider, withSessionSsr } from "context/AppSession";
import Screen from "components/Screen";

export default function School({ session, global }) {
  return (
    <AppSessionContextProvider session={session}>
      <CommonContextProvider context={global}>
        <Screen />
      </CommonContextProvider>
    </AppSessionContextProvider>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return {
      props: {
        global: { page: {}, ua: ctx.req.headers["user-agent"] },
      },
    };
  },
  { redirect: { permanent: false, destination: "/login" } }
);
