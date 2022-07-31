import { useEffect, useState } from "react";
import { parse } from "next-useragent";
import { useCommonContext } from "context/Common";

export default function useUserAgent() {
  const { ua } = useCommonContext();
  const [uaString, setUaString] = useState(ua);

  useEffect(() => {
    setUaString(navigator.userAgent);
  }, []);

  return parse(uaString);
}
