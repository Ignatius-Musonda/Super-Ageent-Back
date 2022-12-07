
// const mongoose = require("mongoose");
const {default : mongoose, model} = require("mongoose"); 



const Transaction = mongoose.Schema({
    transactionType :{
        type : String,
        required : true
    },
    transactionID :{
        type : String,
        required : true
    },
    transactionAmount :{
        type : String,
        required : true
    },
    Agent :{
        type : String, 

    },

    Branch : {
        type : String, 

    },

    TDate : {
        type : String, 
        default : new Date()
    } 

})   

const Model = mongoose.model("Transaction", Transaction);

module.exports = Model; 

   
