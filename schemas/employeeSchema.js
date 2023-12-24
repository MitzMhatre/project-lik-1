const mongoose=require("mongoose")


const employeeSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:[true,"First name is requried"]
    },
    email:{
        type:String,
        required:[true,"Email is requried"]
    },
    phone:{
        type:String,
        required:[true,"Phone number is requried"]
    },
   
    salary:{
        type:String,
        required:[true,"Salary is requried"]
    },
    designation:{
        type:String,
        required:[true,"Designation is requried"]
    }
})
const Employee=mongoose.model("Employee",employeeSchema)
module.exports=Employee
