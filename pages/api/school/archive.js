import { withSession } from "context/AppSession";
import { deleteFileBySchool } from "prisma/services/file";
import { archiveParticipants } from "prisma/services/participant";
import { deleteQRcodesBySchool } from "prisma/services/qrcode";
import { archiveSchool } from "prisma/services/school";

export default withSession(
  async function archive(req, res) {
    const { idString } = req.body;
    console.log(idString);
    await deleteQRcodesBySchool(idString);
    await deleteFileBySchool(idString);
    await archiveParticipants(idString);
    await archiveSchool(idString);
    res.status(200).send();
  },
  { methods: ["POST"], roles: ["admin"] }
);
