import { hashSync } from "bcryptjs";
import { withSession } from "context/AppSession";
import { createSchool } from "prisma/services/school";

export default withSession(async function create(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { school } = req.body;
  const hashPassword = hashSync(school.password, 8);
  await createSchool({ ...school, password: hashPassword });
  res.status(200).send();
});
