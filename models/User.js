const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  avatar: String,
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
  },
  username: {
    type: String,
    maxlength: [20, "Username must be less than 20 characters"],
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  passwordHash: {
    type: String,
  },
  phone: String,
  bio: String,
});

userSchema.plugin(uniqueValidator, {
  message: "'{VALUE}' is already taken",
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject?.passwordHash;
  },
});

module.exports = model("User", userSchema);
