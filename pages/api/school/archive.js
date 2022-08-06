import { withSession } from "context/AppSession";
import { archiveParticipants } from "prisma/services/participant";
import { deleteQRcodesBySchool } from "prisma/services/qrcode";
import { archiveSchool } from "prisma/services/school";

export default withSession(async function archive(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { idString } = req.body;
  await deleteQRcodesBySchool(idString);
  await deleteFileBySchool(idString);
  await archiveParticipants(idString);
  await archiveSchool(idString);
  res.status(200).send();
});
