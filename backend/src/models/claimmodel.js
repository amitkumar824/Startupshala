const mongoose=require("mongoose");

const claim=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
        required:true
    },
    dealId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Deal',
        required:true,  
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    
});
const Claim=new mongoose.model("Claim",claim);
module.exports=Claim;