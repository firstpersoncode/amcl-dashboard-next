import { getParticipantIDCard } from "prisma/services/participant";

export default async function id(req, res) {
  if (req.method !== "GET") return res.status(404).send("Not found");
  if (req.headers["x-api-key"] !== process.env.API_KEY)
    return res.status(401).send("Unauthorized");

  const { id } = req.query;
  const participant = await getParticipantIDCard(id);

  res.status(200).json({ participant });
}
