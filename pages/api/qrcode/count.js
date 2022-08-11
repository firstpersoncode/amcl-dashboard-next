import { withSession } from "context/AppSession";
import { countQRCodes } from "prisma/services/scanned";

export default withSession(
  async function count(req, res) {
    const { filter } = req.body;
    const count = await countQRCodes({
      filter: {
        ...filter,
        ...(filter?.search ? { OR: filter.search.OR, search: undefined } : {}),
      },
    });
    res.status(200).json({ count });
  },
  { methods: ["POST"], roles: ["admin"] }
);
