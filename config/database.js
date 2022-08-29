const mongoose = require("mongoose");
function connectDataBase() {
  return mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`database connect in : ${process.env.DB_URI}`);
    })
    .catch((err) => {
      console.log(`error : ${err}`);
      process.exit(1);
    });
}
module.exports = connectDataBase;
