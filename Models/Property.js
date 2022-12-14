

const {default : mongoose, model} = require("mongoose"); 

const property = mongoose.Schema({ 
    PID : {
        type : String, 
        required : true
        },
    Owner : {
        type : String,
    
    },
     DateAdded : {
        type: Date,
        default: Date.now 
     }, 
     VStatus : {
        type : Boolean,
        default : false
     }

})  

const Model = mongoose.model("Property",property); 

module.exports = Model;

