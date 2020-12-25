/* Imports and Initializers */
const chalk = require('chalk')
const express = require('express')
const app = express()
const server = require('http').Server(app)

console.log(chalk.yellow('Server is running!'))
