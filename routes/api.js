const express = require('express')
const router = express.Router()
const multer = require('multer')
const Database = require('./db')

const db = new Database()

router.get('/', (req, res) => {
	if (req.session.user == undefined) {
		if (req.query.error)
			var error = req.query.error
		res.render('index', {
			error: error
		})
	} else {
		res.redirect('/user')
	}
})

router.get('/user', async (req, res) => {
	if (req.session.user == undefined)
		res.redirect('/')
	else {
		var check = await db.check(req.session.number)
		if (typeof (check) == 'object') {
			req.session.image = check.image
			req.session.pTime = check.time
			req.session.pDate = check.date
			req.session.submitted = check.submitted
		} else {
			req.session.submitted = check
		}
		res.render('user', {
			id: req.sessionID,
			user: req.session.user,
			submitted: req.session.submitted,
			time: req.session.pTime,
			date: req.session.pDate,
			image: req.session.image
		})
	}
})

router.get('/admin', async (req, res) => {
	if (req.session.isAdmin == true) {
		res.render('admin', {
			admin: true,
			user: req.session.user
		})
	} else {
		res.redirect('/')
	}
	
})

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) throw err
		res.redirect('back')
	})
})


router.post('/signup', async (req, res) => {
	res.send(await db.signup(req.body))
})

router.post('/login', async (req, res) => {
	try {
		const user = await db.login(req.body)
		if (user == '1') {
			res.redirect('/?error=' + true)
		} else {
			req.session.user = user.name
			req.session.number = user.studentNumber
			req.session.section = user.section
			req.session.isAdmin = user.isAdmin
			if (req.session.isAdmin == true)
				res.redirect('/admin')
			else
				res.redirect('/user')
		}
	} catch (err){
		console.log(err)
	}
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
  }
})

var upload = multer({ storage: storage })

router.post('/upload', upload.single('image'), async (req, res) => {
	var form = {
		studentNumber: req.session.number,
		name: req.session.user,
		section: req.session.section,
		image: req.file.filename,
		date: new Date(),
		offset: new Date().getTimezoneOffset()
	}
	req.session.submitted = true
	res.send(await db.upload(form))
})

router.get('/attendance/:section/:date', async (req, res) => {
	res.json(await db.getAttendance(req.params.section, req.params.date))
})

module.exports = router