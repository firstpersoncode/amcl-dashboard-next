import { withSession } from "context/AppSession";
import { archiveParticipant } from "prisma/services/participant";

export default withSession(async function archive(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { idString } = req.body;
  await archiveParticipant(idString);
  res.status(200).send();
});
