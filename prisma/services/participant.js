const client = require("../client");

// READ
module.exports.getAllParticipants = async ({
  take,
  skip,
  orderBy,
  order,
  filter,
  include,
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
      ...(include && Object.keys(include).length ? include : {}),
    },
  });

  return participants;
};

module.exports.getParticipant = async (idString) => {
  const participant = await client.participant.findFirst({
    where: { idString },
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
          idString: true,
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

module.exports.getParticipantIDCard = async (idString) => {
  const participant = await client.participant.findUnique({
    where: { idString },
    select: {
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
          scanned: true,
          scannedAt: true,
        },
      },

      school: {
        select: {
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
module.exports.updateParticipant = async (idString, updateData) => {
  const participant = await client.participant.update({
    where: {
      idString,
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

module.exports.deleteParticipant = async (idString) => {
  const participant = await client.participant.delete({
    where: {
      idString,
    },
  });
  return participant;
};

module.exports.archiveParticipants = async (schoolId) => {
  const participants = await client.participant.deleteMany({
    where: {
      schoolId,
    },
  });
  return participants;
};

module.exports.archiveParticipant = async (idString) => {
  const participant = await client.participant.delete({
    where: {
      idString,
    },
  });
  return participant;
};
