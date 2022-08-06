const client = require("../client");

// READ
module.exports.getAllFiles = async () => {
  const files = await client.file.findMany({});
  return files;
};

module.exports.getFile = async (id) => {
  const file = await client.file.findFirst({
    where: { id },
  });
  return file;
};

// CREATE
module.exports.createFile = async (data) => {
  const file = await client.file.create({
    data,
  });
  return file;
};

// UPDATE
module.exports.updateFile = async (id, updateData) => {
  const file = await client.file.update({
    where: {
      id,
    },
    data: updateData,
  });
  return file;
};

module.exports.createOrUpdateFile = async ({ ownerId, type }, data) => {
  let file;

  const dup = await client.file.findFirst({
    where: {
      type,
      ownerId,
    },
  });

  if (dup) {
    file = await client.file.update({
      where: {
        id: dup.id,
      },
      data,
    });
  } else {
    file = await client.file.create({
      data,
    });
  }

  return file;
};

// DELETE
module.exports.deleteFiles = async (id) => {
  const files = await client.file.deleteMany({});
  return files;
};

module.exports.deleteFileBySchool = async (schoolId) => {
  const qrcodes = await client.qrcode.deleteMany({
    where: { owner: { schoolId } },
  });
  return qrcodes;
};

module.exports.deleteFileByOwner = async (ownerId) => {
  const file = await client.file.deleteMany({
    where: {
      owner: { idString: ownerId },
    },
  });
  return file;
};

module.exports.deleteFile = async (id) => {
  const file = await client.file.delete({
    where: {
      id,
    },
  });
  return file;
};
