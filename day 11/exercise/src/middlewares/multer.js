const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
  destinationFolder = "",
  prefix = "POST",
  fileType = "image",
}) => {
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      const fileExtension = file.mimetype.split("/")[1];

      // "Image/png" => [image,png]
      // POST_hsakdsahk12k3.png

      const filename = `${prefix}_${nanoid()}.${fileExtension}`;

      cb(null, filename);
    },
  });
  const uploader = multer({
    storage: storageConfig,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      console.log(file);
      if (file.mimetype.split("/")[0] != fileType) {
        return cb(null, false);
      } else if (
        file.mimetype.split("/")[1] == "png" ||
        file.mimetype.split("/")[1] == "jpg" ||
        file.mimetype.split("/")[1] == "jpeg"
      ) {
        return cb(null, true);
      }
      cb(null, false);
    },
  });

  return uploader;
};

module.exports = { fileUploader };

// exports.multerUpload = multer({ storage: storage, fileFilter: fileFilter });
