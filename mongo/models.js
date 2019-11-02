let mongoose = require("mongoose");

let Schema = mongoose.Schema;

// let doctorSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   name: String,
//   designation: String,
//   opdDays: [],
//   contact: String
// });

let userSchema = new Schema({
  id: String,
  firstName: String,
  lastName: String,
  appointments: {
    name: String,
    phoneNumber: Number,
    time: Date,
    symptoms: String,
    doctor: { type: Schema.Types.ObjectId, ref: "doctors" }
  }
});

let departmentSchema = new Schema({
  id: String,
  name: String,
  pic: String,
  more: String,
  doctors: [],
  diagnosticTests: [
    {
      name: String,
      id: String,
      cost: Number
    }
  ]
});

//module.exports.doctorModel = mongoose.model("doctors", doctorSchema, "doctors");
module.exports.userModel = mongoose.model("users", userSchema, "users");
module.exports.departmentModel = mongoose.model(
  "departments",
  departmentSchema,
  "departments"
);
