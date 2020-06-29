const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// MongoDB
mongoose
	.connect('mongodb+srv://VanillaMix9:hashtagWJSN1@attendance-expressjs-vbg6c.mongodb.net/attendance?retryWrites=true&w=majority', {
		useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
	})
	.then(() => { console.log('MongoDB connected') })
	.catch(err => console.log(err))

// Session Store
var sessionStore = new MongoStore({mongooseConnection: mongoose.connection})
// Session
app.use(session({
	secret: 'dlrowehtanool',
	saveUninitialized: false,
	resave: false,
	store: sessionStore,
	cookie: {
		maxAge: 2 * 60 * 60 * 1000,
	}
}))

// Handlebars
hbs = exphbs.create({

	defaultLayout:'main',
	helpers: {
		section: function(name, options){ 
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this); 
			return null;
		},
		script: function (options) {
			this._script = options.fn(this)
			return null
		},
		equal: function (val, check, options) {
			return val == check ? options.fn(this) : options.inverse(this)
		}
	}    
});

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')


// Use static folder of js and css
app.use('/plugins/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')))
app.use('/plugins/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')))
app.use('/plugins', express.static(path.join(__dirname, '/plugins')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/asset', express.static(path.join(__dirname, '/asset')))
app.use('/js', express.static(path.join(__dirname, '/js')))

app.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
	next()
	})


// Routes
const routes = require('./routes/api')
app.use('/', routes)

// Page not found
app.use(function (req, res, next) {
	res.status(404).render('error', {
		missing: true 
	})
})
var port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
	console.log(`Listening at port ${port}.`)
})