const client = require("../client");

// READ
module.exports.getAllScans = async () => {
  const scans = await client.scan.findMany({});
  return scans;
};

module.exports.getScan = async (id) => {
  const scan = await client.scan.findFirst({
    where: { id },
  });
  return scan;
};

// CREATE
module.exports.createScan = async (data) => {
  const scan = await client.scan.create({
    data,
  });
  return scan;
};

// UPDATE
module.exports.updateScan = async (id, updateData) => {
  const scan = await client.scan.update({
    where: {
      id,
    },
    data: updateData,
  });
  return scan;
};

// DELETE
module.exports.deleteScan = async (id) => {
  const scan = await client.scan.delete({
    where: {
      id,
    },
  });
  return scan;
};
