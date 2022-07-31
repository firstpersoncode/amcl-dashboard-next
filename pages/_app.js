import { useRouter } from "next/router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "styles/globals.scss";

export default function _App({ Component, pageProps }) {
  const { asPath } = useRouter();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "dark",
        },
      })}
    >
      <Component {...pageProps} key={asPath} />
    </ThemeProvider>
  );
}
