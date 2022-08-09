import { hashSync } from "bcryptjs";
import { withSession } from "context/AppSession";
import { createQRcode, deleteQRcodesBySchool } from "prisma/services/qrcode";
import { getSchool, updateSchool } from "prisma/services/school";
import generateUID from "utils/generateUID";

export default withSession(
  async function update(req, res) {
    const { idString, school } = req.body;

    if (school.hasOwnProperty("password")) {
      const hashPassword = hashSync(school.password, 8);
      school.password = hashPassword;
    }

    await updateSchool(idString, school);

    if (school.hasOwnProperty("completed")) {
      const updatedSchool = await getSchool(idString);
      await deleteQRcodesBySchool(updatedSchool.id);
      if (updatedSchool.completed) {
        const { participants } = updatedSchool;
        for (const participant of participants) {
          const qrcode = {
            idString: `${idString}-${generateUID()}`,
            ownerId: participant.id,
          };

          await createQRcode(qrcode);
        }
      }
    }

    res.status(200).send();
  },
  { methods: ["POST"], roles: ["admin"] }
);
