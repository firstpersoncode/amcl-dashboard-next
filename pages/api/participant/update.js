import { withSession } from "context/AppSession";
import { updateParticipant } from "prisma/services/participant";

export default withSession(async function update(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { id, participant } = req.body;
  const updatedParticipant = await updateParticipant(id, participant);
  res.status(200).json(updatedParticipant);
});
