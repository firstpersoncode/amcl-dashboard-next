import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { updateParticipant } from "prisma/services/participant";

export default async function update(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  const e = await getEvent(`${id}.user`);
  const user = e?.event;
  if (!user) return res.status(401).send("Unauthorized");

  const { idString, participant } = req.body;
  const updatedParticipant = await updateParticipant(idString, participant);
  res.status(200).json(updatedParticipant);
}
