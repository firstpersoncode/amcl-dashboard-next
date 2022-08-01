const client = require("../client");

// READ
module.exports.getAllSessions = async () => {
  const sessions = await client.session.findMany({
    include: {
      events: true,
    },
  });
  return sessions;
};

module.exports.getSession = async (id) => {
  const session = await client.session.findFirst({
    where: { id },
    include: {
      events: true,
    },
  });
  return session;
};

// CREATE
module.exports.createSession = async (data) => {
  const session = await client.session.create({
    data,
  });
  return session;
};

// UPDATE
module.exports.updateSession = async (id, updateData) => {
  const session = await client.session.update({
    where: {
      id,
    },
    data: updateData,
  });
  return session;
};

// DELETE
module.exports.deleteSessions = async () => {
  const sessions = await client.session.deleteMany({});
  return sessions;
};

module.exports.deleteSession = async (id) => {
  const session = await client.session.delete({
    where: {
      id,
    },
  });
  return session;
};
