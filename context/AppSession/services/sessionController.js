import { add, isAfter } from "date-fns";
import { sign, verify } from "jsonwebtoken";
import nookies from "nookies";
import { createEvent, deleteEvent, updateEvent } from "prisma/services/event";

import { createSession, getSession } from "prisma/services/session";
import parseUserAgent from "../utils/parseUserAgent";

export default class SessionController {
  constructor(configs, ctx) {
    this.name = configs.name;
    this.maxAge = configs.maxAge;
    this.expiresIn = add(new Date(), { seconds: configs.maxAge });
    this.secretKey = process.env.SESSION_SECRET_KEY;
    this.ctx = ctx;
    this.uaString = ctx.req.headers["user-agent"];
    this.session = undefined;
  }

  async init() {
    await this._getSession();
    if (!this.session) await this._setSession();

    return this._populateSession();
  }

  async fetch() {
    await this._getSession();
    return this._populateSession();
  }

  _parse() {
    return JSON.parse(JSON.stringify(this.session));
  }

  _populateSession() {
    return {
      ...this.session,
      setEvent: this._setEvent.bind(this),
      getEvent: this._getEvent.bind(this),
      deleteEvent: this._deleteEvent.bind(this),
      parse: this._parse.bind(this),
    };
  }

  async _setSession() {
    const userAgent = parseUserAgent(this.uaString);

    this.session = {
      name: this.name,
      event: userAgent,
      expiresIn: this.expiresIn,
    };

    const { id } = await createSession(this.session);
    const token = sign(id, this.secretKey);
    nookies.set(this.ctx, this.session.name, token, {
      maxAge: this.maxAge,
      path: "/",
      httpOnly: true,
    });

    this.session.id = id;
    this.session.events = [];
  }

  async _getSession() {
    const cookies = nookies.get(this.ctx);

    const cookiesObjects = Object.entries(cookies).map(([name, value]) => ({
      name,
      value,
    }));

    const token = cookiesObjects.find((t) => t.name === this.name);

    if (token?.value) {
      try {
        const id = verify(token.value, this.secretKey);
        this.session = await getSession(id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async _setEvent(name, configs) {
    if (!configs) configs = { maxAge: 60, event: { name } };
    const { maxAge = 60, event = { name } } = configs;
    const expiresIn = add(new Date(), { seconds: maxAge });

    const newEvent = {
      name: `${this.session.id}.${name}`,
      event,
      expiresIn,
      archived: false,
    };

    const dup = this._getEvent(name);

    if (dup) {
      this.session.events = this.session.events.map((e) => {
        if (e.name === dup.name) {
          return { ...e, ...newEvent };
        }
        return e;
      });

      await updateEvent(newEvent.name, newEvent);
    } else {
      this.session.events = [
        ...this.session.events,
        { ...newEvent, sessionId: this.session.id },
      ];

      await createEvent({ ...newEvent, sessionId: this.session.id });
    }
  }

  async _deleteEvent(name) {
    this.session.events = this.session.events.filter(
      (event) => event.name !== `${this.session.id}.${name}`
    );

    await deleteEvent(`${this.session.id}.${name}`);
  }

  _getEvent(name) {
    return this.session.events.find(
      (e) =>
        !isAfter(new Date(), new Date(e.expiresIn)) &&
        e.name === `${this.session.id}.${name}`
    );
  }
}
