import { compareSync } from "bcryptjs";
import { add } from "date-fns";
import { sign } from "jsonwebtoken";
import { parse } from "next-useragent";
import { createOrUpdateEvent } from "prisma/services/event";
import { getSchoolByEmail } from "prisma/services/school";
import { createSession } from "prisma/services/session";

export default async function login(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");

  const { email, password } = req.body;
  if (!(email && password)) return res.status(403).send();

  const user = await getSchoolByEmail(email);
  if (!user) return res.status(401).send("Akun tidak ditemukan");

  const eligible = compareSync(password, user.password);
  if (!eligible) return res.status(401).send("Password salah");

  const userAgent = parse(req.headers["user-agent"]);
  const expiresIn = add(new Date(), { seconds: 60 * 60 * 24 * 7 });

  const session = {
    name: "_amclf",
    event: userAgent,
    expiresIn,
  };

  const { id } = await createSession(session);
  const token = sign(id, process.env.SESSION_SECRET_KEY);

  const event = {
    name: `${id}.user`,
    event: {
      oid: user.id,
      id: user.idString,
      email: user.email,
      name: user.name,

      active: user.active,
      completed: user.completed,
    },
    expiresIn,
    archived: false,
  };

  await createOrUpdateEvent(event.name, { ...event, sessionId: id });

  res.status(201).json({ token });
}
