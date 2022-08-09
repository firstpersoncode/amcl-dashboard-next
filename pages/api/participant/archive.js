import { withSession } from "context/AppSession";
import { deleteFileByOwner } from "prisma/services/file";
import { archiveParticipant } from "prisma/services/participant";
import { deleteQRcodeByOwner } from "prisma/services/qrcode";

export default withSession(
  async function archive(req, res) {
    const { idString } = req.body;
    await deleteQRcodeByOwner(idString);
    await deleteFileByOwner(idString);
    await archiveParticipant(idString);
    res.status(200).send();
  },
  { methods: ["POST"], roles: ["admin"] }
);
