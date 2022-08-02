const client = require("../client");

// READ
module.exports.getAllQRcodes = async ({
  take,
  skip,
  orderBy,
  order,
  filter,
}) => {
  const qrcodes = await client.qrcode.findMany({
    where: {
      // ...(!filter?.scannedAt ? { scannedAt: { gte: new Date() } } : {}),
      ...filter,
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
      owner: {
        select: {
          idString: true,
          name: true,
        },
      },
      scannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return qrcodes;
};

module.exports.getQRcode = async (idString) => {
  const qrcode = await client.qrcode.findFirst({
    where: { idString },
    select: {
      id: true,
      idString: true,
      owner: {
        select: {
          name: true,
          email: true,
          school: {
            select: {
              name: true,
              category: true,
              branch: true,
              password: false,
            },
          },
          files: {
            select: {
              type: true,
              name: true,
              url: true,
            },
          },
        },
      },
      scannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return qrcode;
};

module.exports.countQRCodes = async ({ filter }) => {
  const count = await client.qrcode.count();
  return count;
};

// CREATE
module.exports.createQRcode = async (data) => {
  const qrcode = await client.qrcode.create({
    data,
  });
  return qrcode;
};

// UPDATE
module.exports.updateQRcode = async (id, updateData) => {
  const qrcode = await client.qrcode.update({
    where: {
      id,
    },
    data: updateData,
  });
  return qrcode;
};

// DELETE
module.exports.deleteQRcodes = async () => {
  const qrcodes = await client.qrcode.deleteMany({});
  return qrcodes;
};

module.exports.deleteQRcode = async (id) => {
  const qrcode = await client.qrcode.delete({
    where: {
      id,
    },
  });
  return qrcode;
};
