import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, LinearProgress } from "@mui/material";
import { useCommonContext } from "context/Common";

export default function Loader() {
  const { hydrated } = useCommonContext();
  const { asPath, events: RouterEvents } = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== `/${asPath}` && setLoading(true);
    const handleComplete = () => setLoading(false);

    RouterEvents.on("routeChangeStart", handleStart);
    RouterEvents.on("routeChangeComplete", handleComplete);
    RouterEvents.on("routeChangeError", handleComplete);

    return () => {
      RouterEvents.off("routeChangeStart", handleStart);
      RouterEvents.off("routeChangeComplete", handleComplete);
      RouterEvents.off("routeChangeError", handleComplete);
    };
  }, [RouterEvents, asPath]);

  if (!hydrated)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );

  if (!loading) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
