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
      scanned: true,
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
    where: {
      idString,
      scanned: true,
    },
    select: {
      id: true,
      idString: true,
      scanned: true,
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
      scannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return qrcode;
};

module.exports.getValidQRcode = async (idString) => {
  const qrcode = await client.qrcode.findFirst({
    where: {
      idString,
      scanned: false,
    },
    select: {
      id: true,
      idString: true,
      scanned: true,
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
      scannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return qrcode;
};

module.exports.countQRCodes = async ({ filter }) => {
  const count = await client.qrcode.count({
    where: {
      // ...(!filter?.scannedAt ? { scannedAt: { gte: new Date() } } : {}),
      ...filter,
      ...(filter && Object.keys(filter).length ? filter : {}),
    },
  });
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
module.exports.updateQRcode = async (idString, updateData) => {
  const qrcode = await client.qrcode.update({
    where: {
      idString,
    },
    data: updateData,
  });
  return qrcode;
};

module.exports.scanQRCode = async (idString) => {
  const qrcode = await client.qrcode.update({
    where: {
      idString,
    },
    data: {
      scanned: true,
      scannedAt: new Date(),
    },
  });
  return qrcode;
};

// DELETE
module.exports.deleteQRcodes = async () => {
  const qrcodes = await client.qrcode.deleteMany({});
  return qrcodes;
};

module.exports.deleteQRcodesBySchool = async (schoolId) => {
  const qrcodes = await client.qrcode.deleteMany({
    where: { owner: { school: { idString: schoolId } } },
  });
  return qrcodes;
};

module.exports.deleteQRcodeByOwner = async (ownerId) => {
  const qrcode = await client.qrcode.deleteMany({
    where: {
      owner: { idString: ownerId },
    },
  });
  return qrcode;
};

module.exports.deleteQRcode = async (idString) => {
  const qrcode = await client.qrcode.delete({
    where: {
      idString,
    },
  });
  return qrcode;
};
