import { withSession } from "context/AppSession";
import { getAllSchools, getSchool } from "prisma/services/school";

export default withSession(async function read(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");

  const { id } = req.body;
  if (id) {
    const school = await getSchool(id);
    res.status(200).json(school);
  } else {
    const { take, skip, orderBy, order, filter } = req.body;

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
        ...(filter?.search ? { OR: filter.search.OR, search: undefined } : {}),
      },

      orderBy,
      order,
    });
    res.status(200).json(schools);
  }
});
