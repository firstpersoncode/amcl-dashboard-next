import { withSession } from "context/AppSession";
import { countSchools } from "prisma/services/school";

export default withSession(
  async function count(req, res) {
    const { filter } = req.body;
    const count = await countSchools({
      filter: {
        ...filter,
        ...(filter?.search ? { OR: filter.search.OR, search: undefined } : {}),
      },
    });
    res.status(200).json({ count });
  },
  { methods: ["POST"], roles: ["admin"] }
);
