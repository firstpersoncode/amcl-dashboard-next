const client = require("../client");

module.exports.getAllQRcodes = async ({
  take,
  skip,
  orderBy,
  order,
  filter,
}) => {
  const scanneds = await client.scanned.findMany({
    where: {
      //   scanned: true,
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
      idString: true,
      owner: {
        select: {
          idString: true,
          name: true,
        },
      },
      createdAt: true,
    },
  });
  return scanneds;
};

module.exports.getQRcode = async (idString) => {
  const qrcode = await client.scanned.findFirst({
    where: {
      idString,
    },
    select: {
      id: true,
      idString: true,
      owner: {
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
          school: {
            select: {
              idString: true,
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
      createdAt: true,
    },
  });
  return qrcode;
};

module.exports.countQRCodes = async ({ filter }) => {
  const count = await client.scanned.count({
    where: {
      ...filter,
      ...(filter && Object.keys(filter).length ? filter : {}),
    },
  });
  return count;
};

module.exports.scanQRCode = async ({ ownerId, idString }) => {
  const scanned = await client.scanned.create({
    data: {
      ownerId,
      idString,
    },
  });
  return scanned;
};
