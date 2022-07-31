import { CommonContextProvider } from "context/Common";
import { AppSessionContextProvider, withSessionSsr } from "context/AppSession";
import Dashboard from "components/Dashboard";

export default function Index({ session, global }) {
  return (
    <AppSessionContextProvider session={session}>
      <CommonContextProvider context={global}>
        <Dashboard />
      </CommonContextProvider>
    </AppSessionContextProvider>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    // const isLoggedIn = ctx.req.session.getEvent("admin");

    // if (!isLoggedIn) {
    //   return {
    //     redirect: {
    //       permanent: false,
    //       destination: "/login",
    //     },
    //   };
    // }

    return {
      props: {
        global: { page: {}, ua: ctx.req.headers["user-agent"] },
      },
    };
  }
);
