import { withSession } from "context/AppSession";
import { updateParticipant } from "prisma/services/participant";

export default withSession(
  async function update(req, res) {
    const { idString, participant } = req.body;
    const updatedParticipant = await updateParticipant(idString, participant);
    res.status(200).json(updatedParticipant);
  },
  { methods: ["POST"], roles: ["admin"] }
);
