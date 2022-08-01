const client = require("../client");

// READ
module.exports.getAllAdmins = async () => {
  const admins = await client.admin.findMany({});
  return admins;
};

module.exports.getAdmin = async (email) => {
  const admin = await client.admin.findFirst({
    where: { email },
  });
  return admin;
};

// CREATE
module.exports.createAdmin = async (data) => {
  const admin = await client.admin.create({
    data,
  });
  return admin;
};

// UPDATE
module.exports.updateAdmin = async (id, updateData) => {
  const admin = await client.admin.update({
    where: {
      id,
    },
    data: updateData,
  });
  return admin;
};

// DELETE
module.exports.deleteAdmins = async () => {
  const admins = await client.admin.deleteMany({});
  return admins;
};

module.exports.deleteAdmin = async (id) => {
  const admin = await client.admin.delete({
    where: {
      id,
    },
  });
  return admin;
};
