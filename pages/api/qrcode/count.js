import { withSession } from "context/AppSession";
import { countQRCodes } from "prisma/services/qrcode";

export default withSession(async function count(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (!req.session.getEvent("admin")) return res.status(403).send("Forbidden");

  const { filter } = req.body;
  const count = await countQRCodes({
    filter: {
      ...filter,
      ...(filter?.search ? { OR: filter.search.OR, search: undefined } : {}),
    },
  });
  res.status(200).json({ count });
});
