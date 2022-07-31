import { useEffect, useState } from "react";

export default function useCommon(initialContext) {
  const [ctx, setContext] = useState(initialContext);
  useEffect(() => {
    setContext((v) => ({ ...v, hydrated: true }));
  }, []);

  return {
    ...ctx,
    setContext,
  };
}
