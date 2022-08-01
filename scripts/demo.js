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

function generateRandom(min = 0, max = 100) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;

  return rand;
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
  for (let i = 0; i < 3; i++) {
    console.log("Generate schools");
    const school = {
      email: `school@demo+${i}.com`,
      password: hashSync("schooldemo", 8),
      name: `School ${i}`,
      category: ["js", "hs", "univ"][i],
      branch: ["futsal", "dance", "futsal"][i],
      active: true,
      archived: false,
      completed: false,
    };

    const newSchool = await createSchool(school);

    // each schools will have 14 participants
    console.log("Generate participants");
    for (let j = 0; j < 14; j++) {
      const participant = {
        email: `participant@demo+${i}${j}.com`,
        name: `Participant ${j}`,
        phone: "01234567890",
        dob: new Date(),
        gender: j % 2 === 0 ? "female" : "male",
        type: { js: "student", hs: "student", univ: "scholar" }[
          school.category
        ],
        studentId: String(generateRandom(100, 999)),
        class:
          school.category !== "univ" ? String(generateRandom(0, 4)) : undefined,
        futsalPosition:
          school.branch === "futsal"
            ? ["goal", "back", "mid", "forward"][generateRandom(0, 3)]
            : undefined,
        instagram: `@participant-${j}`,
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
        email: `official@demo+${i}${j}.com`,
        name: `Official ${j}`,
        phone: "01234567890",
        dob: new Date(),
        gender: j % 2 === 0 ? "female" : "male",
        type: "official",
        officialPosition:
          school.branch === "futsal"
            ? ["coach", "coachAssistant", "manager", "teacher"][
                school.category !== "univ"
                  ? generateRandom(0, 3)
                  : generateRandom(0, 2)
              ]
            : undefined,
        instagram: `@official-${j}`,
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
    await updateSchool(school.id, { completed: true });

    const { participants } = school;
    for (const participant of participants) {
      const qrcode = {
        value: hashSync(participant.id, 5),
        ownerId: participant.id,
      };

      await createQRcode(qrcode);
    }
  }
}

async function main() {
  await cleadDB();
  await generateAdmin();
  await generateSchools();
  await generateQRCodes();
}

main();
