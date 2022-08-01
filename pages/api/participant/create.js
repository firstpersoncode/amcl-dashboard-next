import { withSession } from "context/AppSession";
import { createParticipant } from "prisma/services/participant";

export default withSession(async function create(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { participant } = req.body;
  const newParticipant = await createParticipant(participant);
  res.status(200).json(newParticipant);
});
