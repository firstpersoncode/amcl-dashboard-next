import { withSession } from "context/AppSession";
import { getValidQRcode, scanQRCode } from "prisma/services/qrcode";

export default withSession(
  async function read(req, res) {
    const { idString } = req.body;
    if (!idString) return res.status(403).send("Forbidden");
    const qrcode = await getValidQRcode(idString);
    if (qrcode) await scanQRCode(idString);
    else return res.status(500).send("QR Code tidak ditemukan atau kadaluarsa");
    res.status(200).json(qrcode);
  },
  { methods: ["POST"], roles: ["admin"] }
);
