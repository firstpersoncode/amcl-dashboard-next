import { verify } from "jsonwebtoken";
import { getEvent } from "prisma/services/event";
import { createOrUpdateFile } from "prisma/services/file";

export default async function upload(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  const e = await getEvent(`${id}.user`);
  const user = e?.event;
  if (!user) return res.status(401).send("Unauthorized");

  const { type, ownerId, file } = req.body;

  await createOrUpdateFile(
    { type, ownerId },
    {
      type,
      name: `${file.newFilename}-${file.originalFilename}`,
      url: `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${file.newFilename}-${file.originalFilename}`,
      ownerId,
    }
  );

  res.status(200).send();
}
