import { withSession } from "context/AppSession";
import { createParticipant } from "prisma/services/participant";

export default withSession(
  async function create(req, res) {
    const { participant } = req.body;
    const newParticipant = await createParticipant(participant);
    res.status(200).json(newParticipant);
  },
  { methods: ["POST"], roles: ["admin"] }
);
