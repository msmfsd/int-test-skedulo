
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var bodyParser = require('body-parser')
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

// Some sample data
var people = [
	{id: "1", name: "Bill Gates", org: "Microsoft"},
	{id: "2", name: "Steve Jobs", org: "Apple"},
	{id: "3", name: "Barack Obama", org: "Government"},
	{id: "4", name: "Jonathan Doe", org: "ACME"}
]

var interests = [
	{personId: "1", name: "Skiing"},
	{personId: "1", name: "Philanthropy"},
	{personId: "2", name: "Fonts"},
	{personId: "3", name: "Basketball"}
]

var skills = [
	{personId: "1", name: "C++"},
	{personId: "1", name: "Basic"},
	{personId: "1", name: "Monopoly"},
	{personId: "2", name: "Turtlenecks"},
	{personId: "2", name: "Instagram"},
	{personId: "3", name: "Basketball"},
	{personId: "3", name: "Cycling"}
]

// API to get a list of people
app.get('/people', function(req, res){
  res.send({ success: true, data: people })
})

// API to get the id of the richest person
app.get('/richest', function(req,res){
  res.send({ success: true, data: { richestPerson: 1 } })
})

// Get a list of interest for the given people ids. (/interests?personIds=1,2,3)
app.get('/interests/:personIds', function(req, res){

  if( ! req.params.personIds ){
    return res.status(500).send({ success: false, message: "Parameter 'personIds' required" })
  }

  var personIds = req.params.personIds.toString().split(",")

	var results = interests.filter(function(interest){
		return personIds.indexOf( interest.personId ) >= 0
	})

	res.send({ success: true, data: results })

})

// Get a list of skills for the given people ids. (/interests?personIds=1,2,3)
app.get('/skills/:personIds', function(req, res){

  if( ! req.params.personIds ){
    return res.status(500).send({ success: false, message: "Parameter 'personIds' required" })
	}

  var personIds = req.params.personIds.toString().split(",")

	var results = skills.filter(function(skill){
		return personIds.indexOf( skill.personId ) >= 0
	})

	res.send({ success: true, data: results })
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
