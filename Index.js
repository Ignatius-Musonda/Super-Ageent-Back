
const express = require("express")
const User = require("./Models/UserModel")
const Property = require("./Models/Property")
const { v4: uuidv4 } = require('uuid');

const app = express(); 
const jwt = require("jsonwebtoken")
const Transaction = require("./Models/Transaction")
const cors = require("cors")
const  mongoose = require("mongoose") 
const url = "mongodb+srv://ignatius:417659Surplus@cluster0.k0gc8cm.mongodb.net/?retryWrites=true&w=majority"

        mongoose.connect(url, {useNewUrlParser :true});  
        const con = mongoose.connection; 
        con.on('open',function(){
            console.log('connnected to DB')
            // console.log(uuidv4())
            


        })


        app.use(cors()); 
        app.use(express.json()) 




        app.listen(2000,()=>{ 
            console.log("Server running on 2000")
        }) 

        // USER AUTHENTICATION
        app.post('/api/register',async (req,res)=>{ 
           
            try{   
                const user = await  User.create({ 
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password,
                    Branch : req.body.Branch,

                })

                res.json({
                    status : "Ok"
                })

            }catch(err){ 

                res.json({
                    status : "error",
                    error : "Duplicate email"
                })
              
            }
        }) 

        app.post('/api/login',async (req,res)=>{ 
           

            const user = await User.findOne({
                email : req.body.email,
                password : req.body.password,  
            }) 
            if(user){ 
            
                // const roles = Object.values({user})
                // var role = user.role;
                const token = jwt.sign(
                    {
                        name: user.name,
                        email: user.email,
                    },
                    'secret123'
                )
        
                res.json({ status: 'ok', 
                    data :{
                        user: user.email ,
                        name: user.name ,
                        role : user.role,
                        Branch : user.Branch,

                    }
                })
                // res.json({ status: 'ok', user: token , role : user.role})
              

            }else{  

                res.json({
                    status : "error",
                    user : false
                })

            }
       
    }) 

         //ADD TRANSACTIONS 
         app.post('/api/addtransaction',async (req,res)=>{ 
          
           
            try{       

                const currentDate = new Date();
                const Year = String(currentDate.getFullYear()).substring(2,4);  // returns last digits the current year
                const Month = currentDate.getMonth()+1;  // returns the current month
                const transID = Year+Month+String(uuidv4()).substring(0,13); // forming unique ID plus date
                // console.log(transID);


                const transact = await  Transaction.create({ 

                    transactionType : req.body.tidType,
                    Agent : req.body.email,
                    transactionID : transID,
                    // transactionID : req.body.TID,
                    Branch : req.body.Branch,
                    transactionAmount :req.body.amount

                })

                res.json({
                    status : "Ok"
                })

            }catch(err){ 

                res.json({
                    status : "error",
                    error : "Invalid entry"
                })
              
            }
        }) 

        //GET AGENT TRANSACTIONS 
        app.get('/api/usertransactions',async (req,res)=>{ 
           
            const token = req.headers['x-access-token']

            try {
                // const decoded = jwt.verify(token, 'secret123')
                // const email = decoded.email
                const transact = await Transaction.find({ Agent: token }); 

               
                
                if(transact){

                    res.json({ status: 'ok', propdata : transact})
                }else{
                    res.json({ status: 'error', error: "invalid request" })
                }
            
                
                
            } catch (error) {
                console.log(error)
                res.json({ status: 'error', error: 'invalid token' })
            }
           
        }) 
        //GET ALL TRANSACTIONS 
        app.get('/api/Alltransactions',async (req,res)=>{ 
           
            const token = req.headers['x-access-token']

            try {
                // const decoded = jwt.verify(token, 'secret123')
                // const email = decoded.email
                const transact = await Transaction.find(); 

               
                
                if(transact){

                    res.json({ status: 'ok', propdata : transact})
                }else{
                    res.json({ status: 'error', error: "invalid request" })
                }
            
                
                
            } catch (error) {
                console.log(error)
                res.json({ status: 'error', error: 'invalid token' })
            }
           
        }) 

        // GET ALL ADMIN TRANSACTIONS 
        app.get('/api/adminoverview',async (req,res)=>{ 
           
            const token = req.headers['x-access-token']

            try {
                // const decoded = jwt.verify(token, 'secret123')
                // const email = decoded.email
                // const transact = await Transaction.find({ Agent: token }); 

                 const stats = await Transaction.aggregate([
                    {
                      $group: {
                        // _id: '$Branch', 
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$TDate" } },
                        totalNumOfBranches: { $sum: 1 },
                        // totalNumOfBranches: { $sum: 1 },
                        Deposits: {$sum: {$cond: [ {$eq: [  "$transactionType", "Deposit" ]} , 1 , 0 ]}},
                        Withdraws: {$sum: {$cond: [ {$eq: [  "$transactionType", "Withdraw" ]} , 1 , 0 ]}},
                        TransactionAmnt: { $sum:"$transactionAmount"},
                        transactionAmount: {"$sum": "$transactionAmount"},
                      },
                    },
                  ]);
                
                if(stats){

                    res.json({ status: 'ok', propdata : stats })
                }else{
                    res.json({ status: 'error', error: "invalid request" })
                }
            
                
                
            } catch (error) {
                console.log(error)
                res.json({ status: 'error', error: 'invalid token' })
            }
           
        }) 





        //ADD PROPERTY  
        app.post('/api/addprop',async (req,res)=>{ 
           
            try{   
                const user = await  Property.create({ 
                    PID : 12,
                    Owner : req.body.email,

                })

                res.json({
                    status : "Ok"
                })

            }catch(err){ 

                res.json({
                    status : "error",
                    error : "Invalid entry"
                })
              
            }
        }) 

       
        //Get ALL PROPERTY 
        app.get('/api/dashboard',async (req,res)=>{ 
           
            const token = req.headers['x-access-token']

            try {
                // const decoded = jwt.verify(token, 'secret123')
                // const email = decoded.email
                const property = await Property.find({ email: token })
                if(property){

                    res.json({ status: 'ok', propdata : property })
                }else{
                    res.json({ status: 'error', error: "invalid request" })
                }
                
                
            } catch (error) {
                console.log(error)
                res.json({ status: 'error', error: 'invalid token' })
            }
           
        }) 




        app.get('/api/dashboard',async (req,res)=>{ 
           
            const token = req.headers['x-access-token']

            try {
                // const decoded = jwt.verify(token, 'secret123')
                // const email = decoded.email
                const user = await User.findOne({ email: token })
                if(user){

                    res.json({ status: 'ok', quote: user.quote ,just :"just"})
                }else{
                    res.json({ status: 'error', error: "invalid request" })
                }
                
                
            } catch (error) {
                console.log(error)
                res.json({ status: 'error', error: 'invalid token' })
            }
           
        }) 
        app.post('/api/dashboard',async (req,res)=>{ 
           
            // const token = req.headers['x-access-token']

            try {
                // const decoded = jwt.verify(token, 'secret123')
                // const email = decoded.email
                // console.log("Here",email);
                await User.updateOne(
                    { email: req.body?.email },
                    { $set: { quote: req.body?.quote } }
                )
        
                 res.json({ status: 'ok' }) 
                
                
            } catch (error) {
                console.log(error,"Here")
                res.json({ status: 'error', error: 'invalid token' })
            }
           
        }) 
      

        app.get('/Hello',(req,res)=>{ 
            
            res.send("Hello")

        })