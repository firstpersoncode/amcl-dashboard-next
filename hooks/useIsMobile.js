import { useEffect, useState } from "react";
import useUserAgent from "./useUserAgent";

export default function useIsMobile() {
  const ua = useUserAgent();
  const [isMobile, setIsMobile] = useState(ua.isMobile);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 992);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
