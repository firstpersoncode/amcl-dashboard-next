import { withSession } from "context/AppSession";
import {
  getAllParticipants,
  getParticipant,
} from "prisma/services/participant";

export default withSession(async function get(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { id } = req.body;
  if (id) {
    const participant = await getParticipant(id);
    res.status(200).json(participant);
  } else {
    const { take, skip, orderBy, order, filter } = req.body;

    const participants = await getAllParticipants({
      take: Number(take),
      skip: Number(skip),

      filter,

      orderBy,
      order,
    });
    res.status(200).json(participants);
  }
});
