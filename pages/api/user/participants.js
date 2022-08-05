import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { getAllParticipants } from "prisma/services/participant";
import { getSchoolStatuses } from "prisma/services/school";

export default async function me(req, res) {
  if (req.method !== "GET") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  const e = await getEvent(`${id}.user`);
  const user = e?.event;
  if (!user) return res.status(401).send("Unauthorized");

  const participants = await getAllParticipants({
    filter: { schoolId: user.oid },
  });

  res.status(200).json({ user });
}