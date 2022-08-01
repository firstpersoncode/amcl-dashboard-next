import axios from "axios";
import { compareSync } from "bcryptjs";
import { withSession } from "context/AppSession";
import { getAdmin } from "prisma/services/admin";

export default withSession(async function login(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  if (req.session.getEvent("admin")) return res.status(403).send("Forbidden");

  const { captcha } = req.body;

  const validateCaptcha = await axios.post(
    "https://hcaptcha.com/siteverify",
    `response=${captcha}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    }
  );

  const isValid = validateCaptcha.data?.success;

  if (!isValid) return res.status(403).send("Invalid captcha");

  const { email, password } = req.body;
  const admin = await getAdmin(email);
  if (!admin) return res.status(404).send("Akun tidak ditemukan");

  const eligible = compareSync(password, admin.password);
  if (!eligible) return res.status(404).send("Password salah");

  await req.session.setEvent("admin", {
    event: {
      email: admin.email,
      name: admin.name,
      role: admin.role,
      active: admin.active,
      archived: admin.archived,
    },
    maxAge: 60 * 60 * 24 * 1, // 1 day
  });

  res.status(200).send("Berhasil login");
});
