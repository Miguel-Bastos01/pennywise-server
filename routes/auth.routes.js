const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require ("jsonwebtoken")
const {isAuthenticated} = require("../middleware/jwt.middleware.js")
const User = require("../models/User.model")

const saltRounds = parseInt(process.env.SALT_ROUNDS)

router.post("/signup", (req, res) =>{
  const {email, password, name} = req.body

  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Please enter an Email, Password and Name"})
    return  
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(email)){
    res.status(400).json({ message: "Please provide a valid email"})
    return
  }
  
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  
  if (!passwordRegex.test(password)){
    res.status(400).json({
      message:
      "Password must have a least 6 characters, one number, one uppercase letter and one lowercase letter"
    })
    return
  }
  
  User.findOne({email})
    .then((foundUser) => {
      if (foundUser){
        res.status(400).json({ message: "Email already used"})
        return
      }

      const salt = bcrypt.genSaltSync(saltRounds)
      const hashedPassword = bcrypt.hashSync(password, salt)

      User.create({ email, password: hashedPassword, name}).then((createdUser) => {
        const {email, name , _id} = createdUser
        const user = {email, name, _id} 
      return res.status(201).json({user: user})

    })
    
    
  }).catch( (err) => {
      res.status(500).json(err) 
      return
    })
})
/*
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (passwordCorrect) {
        const { _id, email, name } = foundUser;
        const payload = { _id, email, name };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); 
});

// router.delete("/delete-user", isAuthenticated ,async (req, res, next) => {

//   const userId = req.payload._id

//   try {
//     await User.findByIdAndDelete(userId)
//     await Expense.deleteMany({ user: userId })
//     res.status(200).send({message: "User account deleted"})
//   }
//   catch (err){
//     next(err)
//   }
// })

// router.get("/verify", isAuthenticated, (req, res, next) => {
//   console.log(`req.payload`, req.payload)
//     res.status(200).json(req.payload);
// });
*/
module.exports = router