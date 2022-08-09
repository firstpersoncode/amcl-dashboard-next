import fs from "fs";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import formidable from "formidable";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminWebp from "imagemin-webp";
import { withSession } from "context/AppSession";
import { createOrUpdateFile, getFile } from "prisma/services/file";

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

const deleteFileIfExist = async ({ type, ownerId }) => {
  const file = await getFile({ type, ownerId });
  if (file) {
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: file.name,
    };

    return s3Client.send(new DeleteObjectCommand(params));
  }
};

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

  if (isCompressed) fs.rmSync(`./tmp/${file.newFilename}`, { recursive: true });
  else fs.unlinkSync(file.filepath);

  return s3Client.send(new PutObjectCommand(params));
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

export default withSession(
  async function upload(req, res) {
    const form = new formidable.IncomingForm();
    return form.parse(req, async function (err, fields, files) {
      if (err) throw err;
      if (!files.file) return res.status(403).send();
      try {
        if (
          !/^image\/((png)|(jpg)|(jpeg)|(svg)|(webp)).*$/g.test(
            files.file.mimetype.toLowerCase()
          )
        )
          return res.status(500).send("File tidak bisa diupload");
        if (files.file.size > 2000000)
          return res
            .status(500)
            .send("File size melebihi 2mb, upload lebih kecil");

        await deleteFileIfExist(fields);
        await uploadToDOSpaces(files.file);
        await saveFile(fields, files.file);

        res.status(201).send("Berhasil upload file");
      } catch (err) {
        res.status(500).send(err);
      }
    });
  },
  { methods: ["POST"], roles: ["admin"] }
);
