import { withSession } from "context/AppSession";
import { getSchoolNames } from "prisma/services/school";

export default withSession(
  async function read(req, res) {
    const schools = await getSchoolNames();
    res.status(200).json(schools);
  },
  { roles: ["admin"], roles: ["admin"] }
);
