import { withSession } from "context/AppSession";
import { countParticipants } from "prisma/services/participant";

export default withSession(
  async function count(req, res) {
    const { filter } = req.body;
    const count = await countParticipants({
      filter: {
        ...filter,
        ...(filter?.search ? { OR: filter.search.OR, search: undefined } : {}),
      },
    });
    res.status(200).json({ count });
  },
  { methods: ["POST"], roles: ["admin"] }
);
