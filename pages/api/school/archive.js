import { withSession } from "context/AppSession";
import { archiveParticipants } from "prisma/services/participant";
import { archiveSchool } from "prisma/services/school";

export default withSession(async function archive(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { id } = req.body;
  await archiveSchool(id);
  await archiveParticipants(id);
  res.status(200).send();
});
