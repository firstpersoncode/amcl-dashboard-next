import { withSession } from "context/AppSession";
import { getAllQRcodes, getQRcode } from "prisma/services/qrcode";

export default withSession(async function read(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { idString } = req.body;
  if (idString) {
    const qrcode = await getQRcode(idString);
    res.status(200).json(qrcode);
  } else {
    const { take, skip, orderBy, order, filter } = req.body;

    const qrcodes = await getAllQRcodes({
      take: Number(take),
      skip: Number(skip),

      filter: {
        ...filter,
        ...(filter?.search ? { OR: filter.search.OR, search: undefined } : {}),
      },

      orderBy,
      order,
    });
    res.status(200).json(qrcodes);
  }
});
