"use strict";

let express = require("express");
let router = express.Router();
let doctor = require("./mongo/models").doctorModel;
let user = require("./mongo/models").userModel;
let department = require("./mongo/models").departmentModel;
let mongoose = require("mongoose");

// Welcome message
router.get("/", (req, res) => {
  res.send("Hi! I am pgiBot's API.");
});

// This is used to get all the doctors of a department.
router.get("/getDepartmentDoctors?", async (req, res) => {
  async function getDepartmentDoctors() {
    return department
      .find({ name: req.query.departmentName })
      .populate("doctors")
      .then(data => {
        return data[0].doctors;
      })
      .catch(error => {
        throw error;
      });
  }
  res.send({
    doctors: await getDepartmentDoctors()
  });
});

// This is used to get details of particular Doctor.
router.get("/getDoctorDetails", async (req, res) => {
  async function getDoctorDetails() {
    return doctor
      .find({ name: req.body.doctorName })
      .then(data => {
        return data[0];
      })
      .catch(error => {
        throw error;
      });
  }
  res.send(await getDoctorDetails());
});

// This is used to add doctors to database.
router.post("/addDoctor", (req, res) => {
  let newDoctor = {
    _id: new mongoose.Types.ObjectId(),
    name: req.body.doctorName,
    designation: req.body.doctorDesignation,
    opdDays: req.body.doctorOpdDays,
    contact: req.body.doctorContact
  };
  doctor
    .create(newDoctor)
    .then(() => {
      department.updateOne(
        { name: req.body.departmentName },
        { $push: { doctors: newDoctor._id } },
        err => {
          if (err) throw err;
          res.end();
        }
      );
    })
    .catch(error => {
      throw error;
    });
});

// This is used to add department to database.
router.post("/addDepartment", (req, res) => {
  department
    .create({
      name: req.body.departmentName,
      info: req.body.departmentInfo,
      pic: req.body.departmentPic,
      more: req.body.departmentMore
    })
    .then(() => {
      res.end();
    })
    .catch(error => {
      throw error;
    });
});

// This is used to get all departments.
router.get("/getAllDepartments", async (req, res) => {
  async function getAllDepartments() {
    return department
      .find({})
      .then(data => {
        let departments = [];
        data.forEach(dept => {
          departments.push(dept.name);
        });
        return departments;
      })
      .catch(error => {
        throw error;
      });
  }
  res.send({
    departments: await getAllDepartments()
  });
});

// This is used to get department Details.
router.get("/getDepartmentDetails", async (req, res) => {
  async function getDepartmentDetails() {
    return department
      .find({ name: req.body.departmentName })
      .then(data => {
        return data[0];
      })
      .catch(error => {
        throw error;
      });
  }
  res.send(await getDepartmentDetails());
});

// This is used to get all the diagnostics test of a particular department.
router.get("/getDepartmentDiagnosticTests", async (req, res) => {
  async function getDepartmentDiagnosticTests() {
    return department
      .find({})
      .then(data => {
        for (let dept of data) {
          if (dept.name == req.body.departmentName) {
            return dept.diagnosticTests;
          }
        }
      })
      .catch(error => {
        throw error;
      });
  }
  res.send({
    diagnosticTests: await getDepartmentDiagnosticTests()
  });
});

//This is used to book appointment.
router.post("/bookAppointment", async (req, res) => {
  async function bookAppointment() {
    return department
      .find({ name: req.body.departmentName })
      .populate("doctors")
      .then(data => {
        for (let doc of data.doctors) {
        }
      })
      .catch(error => {
        throw error;
      });
    /* return user.updateOne(
             { name: req.body.userName },
             {
                 $push: {
                     diagnosticTests: {
                         name: req.body.diagnosticTestName,
                         cost: req.body.diagnosticTestCost
                     }
                 }
             }
         );*/
  }
  res.send();
});

module.exports = router;
