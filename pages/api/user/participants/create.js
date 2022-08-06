import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { createParticipant } from "prisma/services/participant";
import generateUID from "utils/generateUID";

export default async function create(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  const e = await getEvent(`${id}.user`);
  const user = e?.event;
  if (!user) return res.status(401).send("Unauthorized");

  const { participant } = req.body;

  const newParticipant = await createParticipant({
    ...participant,
    idString: `${user.id}-${generateUID()}`,
    schoolId: user.oid,
  });

  res.status(200).json(newParticipant);
}
