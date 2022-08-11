import { withSession } from "context/AppSession";
import { getValidQRcode } from "prisma/services/qrcode";
import { scanQRCode } from "prisma/services/scanned";
import { scanQRCode as scanQRCodeORI } from "prisma/services/qrcode";

export default withSession(
  async function scan(req, res) {
    const { idString } = req.body;
    if (!idString) return res.status(403).send("Forbidden");
    const qrcode = await getValidQRcode(idString);
    if (qrcode) {
      await scanQRCodeORI(qrcode.idString);
      await scanQRCode({ ownerId: qrcode.owner.id, idString: qrcode.idString });
    } else
      return res.status(500).send("QR Code tidak ditemukan atau kadaluarsa");
    res.status(200).json(qrcode);
  },
  { methods: ["POST"], roles: ["admin"] }
);
