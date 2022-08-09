import { withSession } from "context/AppSession";

export default withSession(
  async function logout(req, res) {
    await req.session.deleteEvent("admin");

    res.status(200).send();
  },
  { roles: ["admin"] }
);
