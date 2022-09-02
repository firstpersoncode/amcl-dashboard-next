import { hashSync } from "bcryptjs";
import { withSession } from "context/AppSession";
import { createSchool, getSchool } from "prisma/services/school";

export default withSession(
  async function create(req, res) {
    const { school } = req.body;
    const hashPassword = hashSync(school.password, 8);
    const dup = await getSchoolByName(school.name);
    if (dup)
      return res
        .status(500)
        .send(`Sekolah dengan nama (${school.name}) sudah ada`);
    await createSchool({ ...school, password: hashPassword });
    res.status(200).send();
  },
  { methods: ["POST"], roles: ["admin"] }
);
