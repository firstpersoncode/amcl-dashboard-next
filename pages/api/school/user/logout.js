import { verify } from "jsonwebtoken";
import { deleteEvent } from "prisma/services/event";

export default async function logout(req, res) {
  if (req.method !== "GET") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");
  if (!req.headers["x-token"]) return res.status(401).send("Unauthorized");

  const id = verify(req.headers["x-token"], process.env.SESSION_SECRET_KEY);
  await deleteEvent(`${id}.user`);

  res.status(201).send();
}
