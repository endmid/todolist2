const mongoose = require("mongoose");

const uri =
  "mongodb+srv://turneraiber:test12345@cluster0.t1kecrt.mongodb.net/todolistDB";
const db = mongoose.connection;

mongoose.connect(uri);

db.once("open", (_) => {
  console.log("Database is connected in port 27017");
});
