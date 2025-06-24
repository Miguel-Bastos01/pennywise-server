const { Schema, model } = require("mongoose")

const categorySchema = new Schema ({
    name: {type: String, required: [true, "Please name the expense"], maxlength: 40},
    emoji: {type: String, maxlength: 2}

})

const Category = model("Category", categorySchema)
module.exports = Category