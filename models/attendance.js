const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AttendanceSchema = new Schema({
	studentNumber: {
		type: String,
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
	image: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	offset: {
		type: Number,
		required: true
	}
})

const Attendance = mongoose.model('attendance', AttendanceSchema)
module.exports = Attendance