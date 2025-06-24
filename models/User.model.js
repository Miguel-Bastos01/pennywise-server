const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    email: {type: String, required: [true, "email required"], unique: true},
    password: {type: String, required: [true, "password required"]},
    username: {type: String, unique: true, sparse: true, minlength: 3, maxlength: 20},
    createdAt: {type: Date, default: Date.now},
})

const User = model("User", userSchema)
module.exports = User