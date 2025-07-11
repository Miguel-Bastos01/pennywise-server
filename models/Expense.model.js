const { Schema, model } = require("mongoose")

const expenseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true},
    category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
   },
    amount: {type: Number, required: [true, "please enter amount"], min: 0},
    title: {type: String, required: [true, "Please enter title"], trim: true, maxlength: 50},
    category: {type: String, 
        enum: ['Rent', 'Mortgage', 'Utilities', 'Groceries', 'Transportation',
    'Insurance', 'Healthcare', 'Debt Repayment',
    'Phone Bill', 'Internet', 'Streaming Services', 'Software/Apps', 'Gym Membership',
    'Dining Out', 'Takeout/Delivery', 'Coffee', 'Entertainment', 'Shopping',
    'Beauty & Grooming', 'Gaming', 'Hobbies', 'Alcohol', 'Tobacco/Cannabis',
    'Gifts', 'Impulse Purchase',
    'Education', 'Childcare', 'Pet Care', 'Travel', 'Home Maintenance',
    'Car Maintenance', 'Savings', 'Investment', 'Donations'],
    required: true
    },
    notes:{ type: String, maxlength: 200},
    mood: {type: String,
        enum: ['Good day','Feeling okay', 'Bad day', 'Stressed out', 'Angry'],
        default: 'Feeling okay'
    },
    createdAt: {
        type: Date,
        default: Date.now,
     }


})
const Expense = model("Expense", expenseSchema)
module.exports = Expense