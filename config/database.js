const mongoose = require("mongoose");
function connectDataBase() {
  return mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`database connect in : ${process.env.DB_URI}`);
  });
}
module.exports = connectDataBase;
