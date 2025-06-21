const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require ("jsonwebtoken")
const user = require("../models/User.model")
const {isAuthenticated} = require("../middleware/jwt.middleware.js")
const User = require("../models/User.model")

const saltRounds = process.env.SALT_ROUNDS

