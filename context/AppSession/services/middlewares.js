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

export function withSession(handler) {
  return async (req, res, ...rest) => {
    const configs = sessionConfigs();
    const session = new SessionController(configs, { req, res });
    req.session = await session.fetch();

    if (!req.session) return res.status(403).send("Forbidden resource");

    return handler(req, res, ...rest);
  };
}
