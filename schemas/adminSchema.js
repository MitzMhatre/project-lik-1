const mongoose=require("mongoose")


const adminSchemas=new mongoose.Schema({
    fName:{
        type:String,
        require:[true,"First name is requried"]
    },
    email:{
        type:String,
        require:[true,"email is rrquried"]
    },
    password:{
        type:String,
        require:[true,"phone no.is requried"]
    },
   

})
const Admin=mongoose.model("Admin",adminSchemas)

module.exports=Admin