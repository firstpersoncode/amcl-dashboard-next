import { compareSync, hashSync } from "bcryptjs";
import { add } from "date-fns";
import { sign } from "jsonwebtoken";
import { parse } from "next-useragent";
import { createOrUpdateEvent } from "prisma/services/event";
import { createSchool, getSchoolByEmail } from "prisma/services/school";
import { createSession } from "prisma/services/session";
import generateUID from "utils/generateUID";

export default async function register(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");

  const { name, category, branch, email, password } = req.body;
  if (!(name && category && branch && email && password))
    return res.status(403).send();

  const exists = await getSchoolByEmail(email);
  if (exists)
    return res
      .status(401)
      .send(`Akun dengan email ${email} telah terdaftar, lakukan login.`);

  const hashedPassword = hashSync(password, 8);
  const newUser = await createSchool({
    name,
    category,
    branch,
    email,
    password: hashedPassword,
    idString: generateUID(),
    active: false,
    archived: false,
    completed: false,
  });

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
      oid: newUser.id,
      id: newUser.idString,
      email: newUser.email,
      name: newUser.name,
      category: newUser.category,
      branch: newUser.branch,

      active: newUser.active,
      completed: newUser.completed,
    },
    expiresIn,
    archived: false,
  };

  await createOrUpdateEvent(event.name, { ...event, sessionId: id });

  res.status(201).json({ token });
}
