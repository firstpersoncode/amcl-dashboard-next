import { withSession } from "context/AppSession";

export default withSession(async function logout(req, res) {
  if (req.method !== "GET") return res.status(404).send("Not found");
  if (!req.session.getEvent("admin")) return res.status(403).send("Forbidden");

  await req.session.deleteEvent("admin");

  res.status(200).send("Berhasil logout");
});
