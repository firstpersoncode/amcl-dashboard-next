import { createContext, useContext } from "react";
import useCommon from "./hooks/useCommon";

const context = {
  siteName: "Dashboard",
  page: {},
  hydrated: false,
};

const CommonContext = createContext(context);

export function CommonContextProvider({ children, context: initialContext }) {
  const controlledContext = useCommon(initialContext);

  return (
    <CommonContext.Provider value={controlledContext}>
      {children}
    </CommonContext.Provider>
  );
}

export const useCommonContext = () => useContext(CommonContext);
