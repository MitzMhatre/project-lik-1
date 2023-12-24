const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// CORS - Cross Origin Resource Sharing.
const app = express();

const mongoose = require("mongoose");

// const cors=require('cors')

//for Environment veriable..(.env)
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const Employee = require("./schemas/employeeSchema");
const Admin = require("./schemas/adminSchema");

const bcrypt = require("bcrypt");
const SALT = bcrypt.genSaltSync(10);
let PORT = null;
if (process.env.MODE == "DEV") {
  PORT = process.env.DEV_PORT;
} else if (process.env.MODE == "PORD") {
  PORT = process.env.PROD_PORT;
} else {
  PORT = 3000;
}

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("DB connection sucessfully");
  })
  .catch((err) => {
    console.log("DB Error");
  });

//Employee Routes
app.get("/employee", async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (employees) {
      // res.json({
      //     status:1,
      //     message:"Employees fetched successfully",
      //     data:employees
      // })
      //2nd method...
      res.status(200).json({
        status: 1,
        message: "Employees fetched successfully",
        data: employees,
      });
    } else {
      throw new Error("Could not fetch employees. Please  try again");
    }
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
});

//single employee....
app.get("/employee/:id", async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
    });

    if (employee) {
      res.json({
        status: 1,
        message: "Employee fetched successfully",
        data: employee,
      });
    } else {
      throw new Error("Could not fetch employee. Please  try again");
    }
  } catch (err) {
    res.status(400).json({
      status: 0,
      message: err.message,
    });
  }
});
app.post("/employee", async (req, res) => {
  //     try{
  //         //not work
  //         // const {empFname,empEmail,empPhone,empSalary,empDesignation}=req.body
  //         const {fname,email,phone,salary,designation}=req.body

  //         const employee=new Employee({
  //             //not work
  //             // fname:empFname,
  //             // email:empEmail,
  //             // phone:empPhone,
  //             // salary:empSalary,
  //             // designation:empDesignation
  //             fname,
  //             email,
  //             phone,
  //             salary,
  //             designation
  //         })

  //         const insertedEmployee=await employee.save()

  //         if(insertedEmployee)
  //         {
  //             res.json({
  //                 status:1,
  //                 message:"Employee added successfully",
  //                 data:insertedEmployee
  //             })
  //         }else{
  //             throw new Error("Could not created employee")
  //         }
  //     }catch(err){
  //         res.json({
  //             status:0,
  //             message:err,
  //             data:null
  //         })
  //     }
  // })

  //Task(email and phone)
  try {
    // const {empFname,empEmail,empPhone,empSalary,empDesignation}=req.body
    const { fname, email, phone, salary, designation } = req.body;

    const checkEmployeeEmail = await Employee.findOne({ email });
    const checkEmployeePhone = await Employee.findOne({ phone });
    //
    if (checkEmployeeEmail) {
      console.log("Email already in use");
      res.json({
        status: 0,
        message: "Email is in use",
        data: null,
      });
    } else if (checkEmployeePhone) {
      console.log("Phone no is already in use");
      res.json({
        status: 0,
        message: "Phone is in use",
        data: null,
      });
    } else {
      const employee = new Employee({
        fname,
        email,
        phone,
        salary,
        designation,
      });

      const insertedEmployee = await employee.save();

      if (insertedEmployee) {
        res.json({
          status: 1,
          message: "Employee added successfully",
          data: insertedEmployee,
        });
      } else {
        throw new Error("Could not created employee");
      }
    }
    //
  } catch (err) {
    res.json({
      status: 0,
      message: err,
      data: null,
    });
  }
});
//

app.put("/employee/:id", async (req, res) => {
  try {
    const { empFname, empEmail, empPhone, empSalary, empDesignation } =
      req.body;
    const updatedResult = await Employee.updateOne(
      {
        _id: req.params.id,
      },
      {
        fname: empFname,
        email: empEmail,
        phone: empPhone,
        salary: empSalary,
        designation: empDesignation,
      }
    );

    if (updatedResult) {
      res.json({
        status: 1,
        message: "Employee updated successfully",
        data: updatedResult,
      });
    } else {
      throw new Error("Could not updated employee");
    }
  } catch (err) {
    res.json({
      status: 0,
      message: err,
      data: null,
    });
  }
});

app.delete("/employee/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.deleteOne({
      _id: req.params.id,
    });

    if (deletedEmployee) {
      res.json({
        status: 1,
        message: "Employee deleted successfully",
        data: deletedEmployee,
      });
    } else {
      throw new Error("Could not deleted employee");
    }
  } catch (err) {
    res.json({
      status: 0,
      message: err,
      data: null,
    });
  }
});

//Employee Routes

//Admin Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const adminDocument = await Admin.findOne({ email });

  if (adminDocument) {
    //email is correct
    const hashedPassword = adminDocument.password;
    if (bcrypt.compareSync(password, hashedPassword)) {
      //password is correct

      //generate token
      const token = jwt.sign({ adminEmail: email }, process.env.JWT_SECRET_KEY);
      // const token=jwt.sign(email,process.env.JWT_SECRET_KEY);
      res.json({
        status: 1,
        message: "Login successful",
        data: adminDocument,
        token,
      });
    } else {
      //Password is incorrect
      res.json({
        status: 0,
        message: "Password is incorrect",
        data: null,
      });
    }
  } else {
    res.json({
      status: 0,
      message: "Email is in incorrect",
      data: null,
    });
  }
});

app.post("/register", async (req, res) => {
  const { fname, email, password } = req.body;
  const checkEmailPresent = await Admin.findOne({
    email,
  });
  if (checkEmailPresent) {
    res.json({
      status: 0,
      message: "Admin already present",
      data: null,
    });
  } else {
    let hashedPassword = bcrypt.hashSync(password, SALT);

    const admin = new Admin({
      fname,
      email,
      password: hashedPassword,
    });
    const insertedAdmin = await admin.save();
    res.json({
      status: 1,
      data: insertedAdmin,
    });
  }
});
app.listen(PORT, () => {
  console.log(`server started at port no.${PORT}`);
});
