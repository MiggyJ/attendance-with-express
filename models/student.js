const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
	studentNumber: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	section: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean
	}
})

const Student = mongoose.model('student', StudentSchema)
module.exports = Student