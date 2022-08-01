import { withSession } from "context/AppSession";
import { createSchool } from "prisma/services/school";

export default withSession(async function create(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { school } = req.body;
  const newSchool = await createSchool(school);
  res.status(200).json(newSchool);
});
