import { hashSync } from "bcryptjs";
import { withSession } from "context/AppSession";
import { createQRcode, deleteQRcodesBySchool } from "prisma/services/qrcode";
import { getSchool, updateSchool } from "prisma/services/school";
import generateUID from "utils/generateUID";

export default withSession(async function update(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { idString, school } = req.body;

  if (school.hasOwnProperty("password")) {
    const hashPassword = hashSync(school.password, 8);
    school.password = hashPassword;
  }

  await updateSchool(idString, school);

  if (school.hasOwnProperty("completed")) {
    console.log("QR Code REFRESHED!");
    const updatedSchool = await getSchool(idString);
    await deleteQRcodesBySchool(updatedSchool.id);
    if (updatedSchool.completed) {
      const { participants } = updatedSchool;
      for (const participant of participants) {
        const qrcode = {
          idString: `${participant.idString}-${generateUID()}`,
          ownerId: participant.id,
        };

        await createQRcode(qrcode);
      }
    }
  }

  res.status(200).send();
});
