const client = require("../client");

// READ
module.exports.getAllEvents = async () => {
  const events = await client.event.findMany({});
  return events;
};

module.exports.getEvent = async (name) => {
  const event = await client.event.findFirst({
    where: { name },
  });
  return event;
};

// CREATE
module.exports.createEvent = async (data) => {
  const event = await client.event.create({
    data,
  });
  return event;
};

// UPDATE
module.exports.updateEvent = async (name, updateData) => {
  const event = await client.event.update({
    where: {
      name,
    },
    data: updateData,
  });
  return event;
};

module.exports.createOrUpdateEvent = async (name, data) => {
  const session = await client.event.upsert({
    where: {
      name,
    },
    update: data,
    create: data,
  });
  return session;
};

// DELETE
module.exports.deleteEvents = async () => {
  const events = await client.event.deleteMany({});
  return events;
};

module.exports.deleteEvent = async (name) => {
  const event = await client.event.delete({
    where: {
      name,
    },
  });
  return event;
};
