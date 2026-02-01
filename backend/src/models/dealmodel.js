const mongoose=require("mongoose");

const deal=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    }
    ,
    category:{
        type:String,
        required:true,  
    },
    accessLevel:{
        type:String,
        enum:['public','locked'],
        default:'public'
    }
});
const Deal=new mongoose.model("Deal",deal);
module.exports=Deal;
