import { withSession } from "context/AppSession";
import {
  getAllParticipants,
  getParticipant,
} from "prisma/services/participant";

export default withSession(
  async function get(req, res) {
    const { idString } = req.body;
    if (idString) {
      const participant = await getParticipant(idString);
      res.status(200).json(participant);
    } else {
      const {
        take,
        skip,
        orderBy = "updatedAt",
        order = "desc",
        filter,
      } = req.body;

      const participants = await getAllParticipants({
        take: Number(take),
        skip: Number(skip),

        filter: {
          ...filter,
          ...(filter?.search
            ? { OR: filter.search.OR, search: undefined }
            : {}),
        },

        orderBy,
        order,
      });
      res.status(200).json(participants);
    }
  },
  { methods: ["POST"], roles: ["admin"] }
);
