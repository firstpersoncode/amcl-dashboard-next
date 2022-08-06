import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { getAllParticipants } from "prisma/services/participant";

export default async function participants(req, res) {
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
    include: {
      dob: true,
      studentId: true,
      class: true,
      phone: true,
      gender: true,
      instagram: true,
      futsalPosition: true,
      officialPosition: true,
      files: { select: { type: true, url: true } },
    },
  });

  res.status(200).json({
    participants,
  });
}
