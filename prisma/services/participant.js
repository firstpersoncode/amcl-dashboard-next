const client = require("../client");

// READ
module.exports.getAllParticipants = async ({
  take,
  skip,
  orderBy,
  order,
  filter,
}) => {
  const participants = await client.participant.findMany({
    where: {
      archived: false,
      ...(filter && Object.keys(filter).length ? filter : {}),
    },
    ...(orderBy
      ? {
          orderBy: {
            [orderBy]: order,
          },
        }
      : {}),
    ...(take ? { take } : {}),
    ...(skip ? { skip } : {}),
    select: {
      id: true,
      idString: true,
      name: true,
      email: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return participants;
};

module.exports.getParticipant = async (id) => {
  const participant = await client.participant.findFirst({
    where: { id },
    select: {
      id: true,
      idString: true,
      name: true,
      email: true,
      phone: true,
      dob: true,
      gender: true,
      type: true,
      studentId: true,
      class: true,
      futsalPosition: true,
      officialPosition: true,
      instagram: true,
      active: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
      files: {
        select: {
          type: true,
          name: true,
          url: true,
        },
      },
      qrcode: {
        select: {
          idString: true,
          scannedAt: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
          category: true,
          branch: true,
          password: false,
        },
      },
    },
  });
  return participant;
};

module.exports.countParticipants = async ({ filter }) => {
  const count = await client.participant.count({
    where: {
      archived: false,
      ...(filter && Object.keys(filter).length ? filter : {}),
    },
  });
  return count;
};

// CREATE
module.exports.createParticipant = async (data) => {
  const participant = await client.participant.create({
    data,
  });
  return participant;
};

// UPDATE
module.exports.updateParticipant = async (id, updateData) => {
  const participant = await client.participant.update({
    where: {
      id,
    },
    data: updateData,
  });
  return participant;
};

// DELETE
module.exports.deleteParticipants = async () => {
  const participants = await client.participant.deleteMany({});
  return participants;
};

module.exports.deleteParticipant = async (id) => {
  const participant = await client.participant.delete({
    where: {
      id,
    },
  });
  return participant;
};

module.exports.archiveParticipants = async (schoolId) => {
  const participants = await client.participant.updateMany({
    where: {
      schoolId,
    },
    data: {
      archived: true,
    },
  });
  return participants;
};

module.exports.archiveParticipant = async (id) => {
  const participant = await client.participant.update({
    where: {
      id,
    },
    data: {
      archived: true,
    },
  });
  return participant;
};
