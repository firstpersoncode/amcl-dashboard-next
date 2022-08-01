import { withSession } from "context/AppSession";
import { getSchoolNames } from "prisma/services/school";

export default withSession(async function read(req, res) {
  if (req.method !== "GET") return res.status(404).send("Not found");

  const schools = await getSchoolNames();
  res.status(200).json(schools);
});
