const mongoose = require("mongoose");
const connectionString = process.env.MONGO_DB_URI;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

process.on("uncaughtException", (error) => {
  mongoose.connection.close().then(() => console.log("close connection"));
  console.log({ error });
});
