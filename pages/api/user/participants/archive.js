import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { deleteFileByOwner } from "prisma/services/file";
import { archiveParticipant } from "prisma/services/participant";
import { deleteQRcodeByOwner } from "prisma/services/qrcode";

export default async function archive(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  const e = await getEvent(`${id}.user`);
  const user = e?.event;
  if (!user) return res.status(401).send("Unauthorized");

  const { idString } = req.body;
  await deleteQRcodeByOwner(idString);
  await deleteFileByOwner(idString);
  await archiveParticipant(idString);
  res.status(200).send();
}
