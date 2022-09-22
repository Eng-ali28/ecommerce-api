const multer = require("multer");
const ApiError = require("../utils/ApiError");
function multerOptions() {
  const storage = multer.memoryStorage();
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Allow image only", 400));
    }
  };
  return {
    storage,
    fileFilter,
  };
}
exports.uploadSingleImage = (name) => {
  const upload = multer(multerOptions());
  return upload.single(name);
};

exports.uploadMixImages = (arrayFields) => {
  const upload = multer(multerOptions());
  return upload.fields(arrayFields);
};
