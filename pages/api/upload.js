import fs from "fs";
import formidable from "formidable";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminWebp from "imagemin-webp";
import { withSession } from "context/AppSession";
import { createOrUpdateFile } from "prisma/services/file";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async ({ type, ownerId }, file) => {
  const data = fs.readFileSync(file.filepath);
  const uploadDir = "./public/upload";

  if (!fs.existsSync(`${uploadDir}/${ownerId}/${type}`)) {
    fs.mkdirSync(`${uploadDir}/${ownerId}/${type}`, { recursive: true });
  } else {
    fs.rmdirSync(`${uploadDir}/${ownerId}/${type}`, { recursive: true });
    fs.mkdirSync(`${uploadDir}/${ownerId}/${type}`, { recursive: true });
  }

  fs.writeFileSync(
    `${uploadDir}/${ownerId}/${type}/${file.originalFilename}`,
    data
  );

  fs.unlinkSync(file.filepath);

  const fileExt = file.originalFilename.split(".").pop().toLowerCase();
  const plugins = [];
  if (["jpg", "jpeg"].includes(fileExt))
    plugins.push(imageminMozjpeg({ quality: 65 }));
  else if (fileExt === "png") plugins.push(imageminPngquant([0.5, 0.65]));
  else if (fileExt === "webp") plugins.push(imageminWebp({ quality: 65 }));
  else throw new Error("File not supported");

  const files = await imagemin([`${uploadDir}/${ownerId}/${type}/*`], {
    destination: `${uploadDir}/${ownerId}/${type}/compressed`,
    plugins,
  });

  fs.unlinkSync(`${uploadDir}/${ownerId}/${type}/${file.originalFilename}`);

  const compressedFile = files[0];
  const destinationPath = compressedFile.destinationPath
    .replace(/\\/g, "/")
    .split("/");

  destinationPath.shift();

  await createOrUpdateFile(
    { type, ownerId },
    {
      type,
      name: destinationPath[destinationPath.length - 1],
      url: `/${destinationPath.join("/")}`,
      ownerId,
    }
  );

  return;
};

export default withSession(async function upload(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  const admin = req.session.getEvent("admin");
  if (!admin || admin.role < 2) return res.status(403).send("Forbidden");

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    try {
      await saveFile(fields, files.file);
      if (err) throw err;
      res.status(201).send();
    } catch (err) {
      res.status(500).send(err);
    }
  });
});
