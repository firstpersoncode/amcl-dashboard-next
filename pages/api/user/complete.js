import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { createQRcode, deleteQRcodesBySchool } from "prisma/services/qrcode";
import { getSchool, updateSchool } from "prisma/services/school";
import generateUID from "utils/generateUID";

export default async function complete(req, res) {
  if (req.method !== "GET") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  const e = await getEvent(`${id}.user`);
  const user = e?.event;
  if (!user) return res.status(401).send("Unauthorized");

  const school = await getSchool(user.id);
  if (!school) return res.status(404).send();

  if (school.completed) return res.status(403).send("QR Code sudah dibuat");

  await deleteQRcodesBySchool(school.id);
  await updateSchool(school.idString, { completed: true });

  const { participants } = school;
  for (const participant of participants) {
    const qrcode = {
      idString: `${participant.idString}-${generateUID()}`,
      ownerId: participant.id,
    };

    await createQRcode(qrcode);
  }

  res.status(201).send();
}
