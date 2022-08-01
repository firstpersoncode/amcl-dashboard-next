const client = require("../client");

// READ
module.exports.getAllSchools = async ({
  take,
  skip,
  orderBy,
  order,
  filter,
  include,
}) => {
  const schools = await client.school.findMany({
    where: {
      archived: false,
      ...(filter && Object.keys(filter).length ? filter : {}),
    },
    ...(orderBy
      ? orderBy === "participants"
        ? {
            orderBy: {
              participants: {
                _count: order,
              },
            },
          }
        : {
            orderBy: {
              [orderBy]: order,
            },
          }
      : {}),
    ...(take ? { take } : {}),
    ...(skip ? { skip } : {}),

    select: {
      id: true,
      name: true,
      active: true,
      completed: true,
      createdAt: true,
      updatedAt: true,
      ...(include && Object.keys(include).length ? include : {}),
    },
  });

  return schools;
};

module.exports.getSchool = async (id) => {
  const school = await client.school.findFirst({
    where: { id },
    select: {
      name: true,
      email: true,
      category: true,
      branch: true,
      active: true,
      completed: true,
      archived: true,
      password: false,
      createdAt: true,
      updatedAt: true,
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
          dob: true,
          gender: true,
          type: true,
        },
      },
    },
  });
  return school;
};

module.exports.countSchools = async ({ filter }) => {
  const count = await client.school.count({
    where: {
      archived: false,
      ...(filter && Object.keys(filter).length ? filter : {}),
    },
  });
  return count;
};

module.exports.getSchoolNames = async () => {
  const names = await client.school.findMany({
    select: { name: true },
  });
  return names;
};

// CREATE
module.exports.createSchool = async (data) => {
  const school = await client.school.create({
    data,
  });
  return school;
};

// UPDATE
module.exports.updateSchool = async (id, updateData) => {
  const school = await client.school.update({
    where: {
      id,
    },
    data: updateData,
  });
  return school;
};

// DELETE
module.exports.deleteSchools = async () => {
  const schools = await client.school.deleteMany({});
  return schools;
};

module.exports.deleteSchool = async (id) => {
  const school = await client.school.delete({
    where: {
      id,
    },
  });
  return school;
};

module.exports.archiveSchool = async (id) => {
  const school = await client.school.update({
    where: {
      id,
    },
    data: {
      archived: true,
    },
  });
  return school;
};
