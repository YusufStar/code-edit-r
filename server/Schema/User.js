import Mongoose from "mongoose"
const FilesSchema = new Mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true
  }
});

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  files: [FilesSchema]
});

const User = Mongoose.model("user", UserSchema);

export default User;