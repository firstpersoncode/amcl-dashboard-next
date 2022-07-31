import { createContext, useContext } from "react";
import { withSessionSsr, withSession } from "./services/middlewares";

const context = {};

const AppSessionContext = createContext(context);

export function AppSessionContextProvider({ children, AppSession }) {
  return (
    <AppSessionContext.Provider value={AppSession}>
      {children}
    </AppSessionContext.Provider>
  );
}

export const useAppSessionContext = () => useContext(AppSessionContext);

export { withSessionSsr, withSession };
