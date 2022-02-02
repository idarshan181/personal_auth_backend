const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => {
      console.log("Error connecting to DB, Exiting . . .");
      console.error(err);
      process.exit(1);
    });
};
