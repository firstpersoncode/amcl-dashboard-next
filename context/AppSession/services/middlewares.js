import sessionConfigs from "../utils/sessionConfigs";
import SessionController from "./sessionController";

export function withSessionSsr(handler) {
  return async (ctx) => {
    const configs = sessionConfigs();
    const session = new SessionController(configs, ctx);
    ctx.req.session = await session.init();

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
  { roles = ["user", "admin"], methods = ["GET"], isLoggedIn = true }
) {
  return async (req, res, ...rest) => {
    if (!methods.includes(req.method)) return res.status(404).send("Not found");

    const configs = sessionConfigs();
    const session = new SessionController(configs, { req, res });
    req.session = await session.fetch();

    if (!req.session?.id) return res.status(403).send("Forbidden resource");

    const { e } = req.query;
    if (!e || !roles.includes(e)) return res.status(403).send("Forbidden");
    const loggedIn = isLoggedIn
      ? !req.session.getEvent(e)
      : req.session.getEvent(e);

    if (loggedIn) return res.status(403).send("Forbidden");

    return handler(req, res, ...rest);
  };
}
