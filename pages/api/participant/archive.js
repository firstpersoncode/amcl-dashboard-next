import { withSession } from "context/AppSession";
import { archiveParticipant } from "prisma/services/participant";

export default withSession(async function archive(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { id } = req.body;
  await archiveParticipant(id);
  res.status(200).send();
});
