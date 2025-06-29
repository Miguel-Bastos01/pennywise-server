const express = require("express")
const router = express.Router()
const {isAuthenticated} = require("../middleware/jwt.middleware.js")
const Expense = require("../models/Expense.model.js")


router.get("/expenses", isAuthenticated, (req, res, next )=> {
   
 Expense.find({user: req.payload._id})
 
    .sort({createdAt: -1})
    .then ((allUserExpenses) => res.json(allUserExpenses))
    .catch ((err) => {next (err)})
});


router.post("/expenses", isAuthenticated, async (req, res, next) =>{
  const {user, category, amount, title, notes, mood} = req.body
  const userId = req.payload._id

  if (!category ||!amount  ||!title ){
   return res.status(400).json({ message: "Missing required field"})
      }
      try {
        const expense = await Expense.create({
            user: userId,
            category,
            amount,
            title,
            notes,
            mood,
        })
        res.status(201).json(expense)
        console.log("Expense created successfully")
      }
      catch(err){
        next(err)
      }

  
  })
  module.exports = router