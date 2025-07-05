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
 
   


router.post("/expenses", isAuthenticated, (req, res, next) =>{
  const {category, amount, title, notes, mood} = req.body
  const userId = req.payload._id

  if (!category ||!amount  ||!title ){
   return res.status(400).json({ message: "Missing required field"})
      }
      Expense.create({
            user: userId,
            category,
            amount,
            title,
            notes,
            mood,
        })
          .then((expense) => {
            res.status(201).json(expense)
            console.log("Expense created successfully")
          })
          .catch((err) => {
            next (err)
          })
})

router.get("/expenses/:id", isAuthenticated, (req, res, next) =>{
  const {id} = req.params

  Expense.findOne({_id: id, user: req.payload._id})
    .then((expense) => {
      if (!expense) {
        return res.status(404).json({ message: "Expense not found"})
      }
      res.json(expense)
    })
    .catch((err) => next(err))
})

router.put("/expenses/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params
  const {category, amount, title, notes, mood} = req.body

  Expense.findOneAndUpdate(
    {_id: id, user: req.payload._id},
    {category, amount, title, notes, mood},
    {new: true}
  )
    .then ((updatedExpense) =>{
      if (!updatedExpense) {
        return res.status(404).json ({ message: "Expense not found or unauthorised"})
      }
      res.status(200).json(updatedExpense)
    })
    .catch((err) => next (err))
})

router.delete("/expenses/:id", isAuthenticated, (req, res, next) =>{
  const {id} = req.params

  Expense.findOneAndDelete({_id: id, user: req.payload._id})
    .then((deletedExpense) => {
      if (!deletedExpense) {
        return res.status(404).json({ message: "Expense not found or unauthorized"})
      }
      res.status(200).json({ message: "Expense deleted successfully"})
    })
    .catch((err) => next(err))
})
  module.exports = router