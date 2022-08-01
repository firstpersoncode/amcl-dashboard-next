import { withSession } from "context/AppSession";
import { updateSchool } from "prisma/services/school";

export default withSession(async function update(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { id, school } = req.body;
  const updatedSchool = await updateSchool(id, school);
  res.status(200).json(updatedSchool);
});
