const bcrypt = require('bcrypt')
const Student = require('../models/student')
const Attendance = require('../models/attendance')

class Database{


	signup(form) {
		return new Promise((resolve, reject) => {
			try {
				bcrypt.hash(form.sPassword, 10, (err, hash) => {
					var newStudent = new Student({
						studentNumber: form.sNumber,
						name: form.sFirstName + ' ' + form.sLastName,
						section: form.sSection,
						password: hash,
						isAdmin: 0
					})
					newStudent
						.save()
						.then(() => { return resolve("0") })
						.catch((err) => { return resolve("1") })
				})
			} catch (error) {
				return reject(error)
			}
		})
	}



	login(form) {
		return new Promise((resolve, reject) => {
			try {
				Student
					.findOne({ 'studentNumber': form.logNumber })
					.then(user => {
						if (user == null) { 
							return resolve('1')
						} else {
							bcrypt.compare(form.logPassword, user.password, (err, match) => {
								return match ? resolve(user) : resolve('1')
							})
						}
					})
					.catch((err) => console.log(err.message))
			} catch (error) {
				reject(error)
			}
		})
	}



	check(number) {
		return new Promise((resolve, reject) => {
			try {
				Attendance
					.findOne(
						{ studentNumber: number, date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23,59,59,999) } },
						{ image: 1, date: 1, offset: 1})
					.then(result => {
						return result != null ? resolve({image: result.image, submitted: true, date:new Date(result.date.getTime() - (result.offset * 60000)).toString().substr(4,11), time: new Date(result.date.getTime() - (result.offset * 60000)).toTimeString().substr(0,5)}) : resolve(false)
					})
			} catch (error) {
				reject (error)
			}
		})
	}

	upload(form) {
		return new Promise((resolve, reject) => {
			try {
				var proof = new Attendance(form)
				proof
					.save()
					.then(()=>{return resolve()})
			} catch (error){
				return reject(error)
			}
		})
	}

	getAttendance(section, date) {
		return new Promise((resolve, reject) => {
			try {
				var min = new Date(date)
				var max = new Date(min.getTime() + (24 * 60 * 60 * 1000))
				var results = []
				Attendance
					.find(
						{ section: section, date: { $gte: min, $lt: max } },
						{studentNumber: 1, name: 1, image: 1, date: 1, offset:1}
					)
					.then(result => {
						result.forEach(element => {
							var isLate = new Date(element.date.getTime() - (element.offset * 60000)).getHours() < 8 ? 'Good' : 'Late'
							var row = {
								studentNumber: element.studentNumber,
								name: element.name,
								image: element.image,
								isLate: isLate
							}
							results.push(row)
						})
						return resolve(results)
					})
			} catch (error) {
				reject(error)
			}
		})
	}
}


module.exports = Database