const client = require("../client");

// READ
module.exports.getAllQRcodes = async () => {
  const qrcodes = await client.qrcode.findMany({});
  return qrcodes;
};

module.exports.getQRcode = async (id) => {
  const qrcode = await client.qrcode.findFirst({
    where: { id },
  });
  return qrcode;
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
