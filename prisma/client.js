const { PrismaClient } = require("@prisma/client");

let prisma;

if (typeof window === "undefined") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
