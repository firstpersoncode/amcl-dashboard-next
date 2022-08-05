const { hashSync } = require("bcryptjs");
const { deleteQRcodes, createQRcode } = require("../prisma/services/qrcode");
const { createAdmin, deleteAdmins } = require("../prisma/services/admin");
const {
  createParticipant,
  deleteParticipants,
} = require("../prisma/services/participant");
const {
  createSchool,
  deleteSchools,
  getAllSchools,
  updateSchool,
} = require("../prisma/services/school");
const { deleteSessions } = require("../prisma/services/session");
const { deleteEvents } = require("../prisma/services/event");
const { deleteFiles } = require("../prisma/services/file");

function generateRandom(min = 46656, max = 99999) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;

  return rand;
}

function generateUID() {
  let firstPart = (Math.random() * generateRandom()) | 0;
  let secondPart = (Math.random() * generateRandom()) | 0;
  firstPart = ("0000" + firstPart.toString(36)).slice(-4);
  secondPart = ("0000" + secondPart.toString(36)).slice(-4);
  return (firstPart + secondPart).toUpperCase();
}

async function cleadDB() {
  // clean
  console.log("Clean database");
  await deleteEvents();
  await deleteSessions();
  await deleteAdmins();

  await deleteQRcodes();
  await deleteFiles();
  await deleteParticipants();
  await deleteSchools();
}

async function generateAdmin() {
  // create admin
  console.log("Create Admin");
  const admin = {
    email: "admin@demo.com",
    password: hashSync("admindemo", 8),
    name: "Admin Demo",
    role: 2,
    active: true,
    archived: false,
  };

  await createAdmin(admin);
}

async function generateSchools() {
  // create 3 schools (js, hs, univ)
  for (let i = 0; i < 100; i++) {
    console.log("Generate schools");
    const school = {
      idString: generateUID(),
      email: `school@demo+${generateUID()}.com`,
      password: hashSync("schooldemo", 8),
      name: `School ${i}`,
      category: ["js", "hs", "univ"][generateRandom(0, 2)],
      branch: ["futsal", "dance", "futsal"][generateRandom(0, 2)],
      active: true,
      archived: false,
      completed: false,
    };

    const newSchool = await createSchool(school);

    // each schools will have 14 participants
    console.log("Generate participants");
    for (let j = 0; j < 14; j++) {
      const participant = {
        idString: generateUID(),
        email: `participant@demo+${generateUID()}.com`,
        name: `Participant ${j}`,
        phone: "01234567890",
        dob: new Date(),
        gender: ["male", "female"][generateRandom(0, 1)],
        type: "participant",
        studentId: `${generateUID()}-${generateUID()}`,
        class:
          school.category !== "univ" ? String(generateRandom(0, 4)) : undefined,
        futsalPosition:
          school.branch === "futsal"
            ? ["goal", "back", "mid", "forward"][generateRandom(0, 3)]
            : undefined,
        instagram: `@participant-${generateUID()}`,
        schoolId: newSchool.id,
        active: true,
        archived: false,
      };

      await createParticipant(participant);
    }

    // js and hs will have 3 officials
    // univ will have 2 officials
    console.log("Generate officials");
    const limitOfficials = { js: 3, hs: 3, univ: 2 }[school.category];
    for (let j = 0; j < limitOfficials; j++) {
      const participant = {
        idString: generateUID(),
        email: `official@demo+${generateUID()}.com`,
        name: `Official ${j}`,
        phone: "01234567890",
        dob: new Date(),
        gender: ["male", "female"][generateRandom(0, 1)],
        type: "official",
        officialPosition:
          school.branch === "futsal"
            ? ["coach", "coachAssistant", "manager", "teacher"][
                school.category === "univ"
                  ? generateRandom(0, 2)
                  : generateRandom(0, 3)
              ]
            : undefined,
        instagram: `@official-${generateUID()}`,
        schoolId: newSchool.id,
        active: true,
        archived: false,
      };

      await createParticipant(participant);
    }
  }
}

async function generateQRCodes() {
  console.log("Generate QR codes");
  const schools = await getAllSchools({ include: { participants: true } });
  for (const school of schools) {
    console.log(`switch ${school.name}'s completed status to 'true'`);
    await updateSchool(school.idString, { completed: true });

    const { participants } = school;
    for (const participant of participants) {
      const qrcode = {
        idString: generateUID(),
        ownerId: participant.id,
      };

      await createQRcode(qrcode);
    }
  }
}

async function main() {
  await cleadDB();
  await generateAdmin();
  // await generateSchools();
  // await generateQRCodes();
}

main();
