import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

const s3Client = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

const resizeFile = async ({
  source,
  destination,
  filepath,
  originalFilename,
}) => {
  const stats = fs.statSync(filepath);
  const fileSizeInBytes = stats.size;
  const quality = fileSizeInBytes > 1000000 ? 10 : 30;

  const fileExt = originalFilename.split(".").pop().toLowerCase();
  const plugins = [];
  if (["jpg", "jpeg"].includes(fileExt))
    plugins.push(imageminMozjpeg({ quality }));
  else if (fileExt === "png") plugins.push(imageminPngquant([quality / 100]));
  else if (fileExt === "webp") plugins.push(imageminWebp({ quality }));

  if (!fs.existsSync(source)) {
    fs.mkdirSync(source, { recursive: true });
  }

  const data = fs.readFileSync(filepath);
  fs.writeFileSync(`${source}/${originalFilename}`, data);

  await imagemin([`${source}/${originalFilename}`], {
    destination,
    plugins,
  });

  return source;
};

const uploadToDOSpaces = async (file) => {
  let isCompressed;
  if (file.size > 500000)
    isCompressed = await resizeFile({
      source: `./tmp/${file.newFilename}`,
      destination: `./tmp/${file.newFilename}/compressed`,
      filepath: file.filepath,
      originalFilename: file.originalFilename,
    });

  const Body = fs.readFileSync(
    isCompressed
      ? `${isCompressed}/compressed/${file.originalFilename}`
      : file.filepath
  );

  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: `${file.newFilename}-${file.originalFilename}`,
    Body,
    ACL: "public-read",
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(params));

  if (isCompressed) fs.rmSync(`./tmp/${file.newFilename}`, { recursive: true });
  else fs.unlinkSync(file.filepath);
};

const saveFile = async ({ type, ownerId }, file) => {
  return createOrUpdateFile(
    { type, ownerId },
    {
      type,
      name: `${file.newFilename}-${file.originalFilename}`,
      url: `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${file.newFilename}-${file.originalFilename}`,
      ownerId,
    }
  );
};

export default withSession(async function upload(req, res) {
  if (req.method !== "POST") return res.status(404).send("Not found");
  const admin = req.session.getEvent("admin");
  if (!admin || admin.role < 2) return res.status(403).send("Forbidden");

  const form = new formidable.IncomingForm();
  return form.parse(req, async function (err, fields, files) {
    if (!files.file) return res.status(403).send();
    try {
      if (
        !/^image\/((png)|(jpg)|(jpeg)|(svg)|(webp)).*$/g.test(
          files.file.mimetype.toLowerCase()
        )
      )
        throw "File not supported";
      if (files.file.size > 3000000)
        throw "File size melebihi 3mb, upload lebih kecil";

      await uploadToDOSpaces(files.file);
      await saveFile(fields, files.file);
      if (err) throw err;
      res.status(201).send("Berhasil upload file");
    } catch (err) {
      res.status(500).send(err);
    }
  });
});
