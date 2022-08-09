import sessionConfigs from "../utils/sessionConfigs";
import SessionController from "./sessionController";

export function withSessionSsr(
  handler,
  {
    name = process.env.SESSION_NAME,
    role = process.env.SESSION_ROLE,
    errorOnLoggedIn = false,
    byPass = false,
    redirect,
  }
) {
  return async (ctx) => {
    const configs = sessionConfigs(name);
    const session = new SessionController(configs, ctx);
    ctx.req.session = await session.init();

    if (!byPass) {
      const loggedIn = errorOnLoggedIn
        ? !ctx.req.session.getEvent(role)
        : ctx.req.session.getEvent(role);

      if (!loggedIn) {
        if (redirect)
          return {
            redirect,
          };
        else return { notFound: true };
      }
    }

    const returnHandler = await handler(ctx);

    return {
      ...returnHandler,
      props: {
        ...returnHandler.props,
        session: ctx.req.session.parse(),
      },
    };
  };
}

export function withSession(
  handler,
  {
    name = process.env.SESSION_NAME,
    role = process.env.SESSION_ROLE,
    roles = ["user", "admin"],
    methods = ["GET"],
    errorOnLoggedIn = false,
    byPass = false,
  }
) {
  return async (req, res, ...rest) => {
    if (!methods.includes(req.method)) return res.status(404).send();

    const configs = sessionConfigs(name);
    const session = new SessionController(configs, { req, res });
    req.session = await session.fetch();

    if (!req.session?.id) return res.status(403).send();

    if (!byPass) {
      if (!role || !roles.includes(role)) return res.status(403).send();
      const loggedIn = errorOnLoggedIn
        ? !req.session.getEvent(role)
        : req.session.getEvent(role);

      if (!loggedIn) {
        return res.status(404).send();
      }
    }

    return handler(req, res, ...rest);
  };
}
