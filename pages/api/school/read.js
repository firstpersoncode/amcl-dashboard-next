import { withSession } from "context/AppSession";
import { getAllSchools, getSchool } from "prisma/services/school";

export default withSession(
  async function read(req, res) {
    const { idString } = req.body;
    if (idString) {
      const school = await getSchool(idString);
      res.status(200).json(school);
    } else {
      const {
        take,
        skip,
        orderBy = "updatedAt",
        order = "desc",
        filter,
      } = req.body;

      const schools = await getAllSchools({
        include: {
          _count: {
            select: { participants: true },
          },
        },

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
      res.status(200).json(schools);
    }
  },
  { methods: ["POST"], roles: ["admin"] }
);
