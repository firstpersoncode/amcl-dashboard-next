import { CommonContextProvider } from "context/Common";
import { AppSessionContextProvider, withSessionSsr } from "context/AppSession";
import ModalLogin from "components/ModalLogin";

export default function Login({ session, global }) {
  return (
    <AppSessionContextProvider session={session}>
      <CommonContextProvider context={global}>
        <ModalLogin />
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
  { errorOnLoggedIn: true, redirect: { permanent: false, destination: "/" } }
);
