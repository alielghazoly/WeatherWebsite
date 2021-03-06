const path = require('path')
const express = require('express')
const hbs = require('hbs')
var request = require("request");

const app = express()
const port = process.env.PORT || 3000


  
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Andrew Mead'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error:'you must provide address'
        })
    }
    else{
        var options = {
            method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            qs: {
              callback: '',
              id: '',
              units: '',
              mode: '',
              q: req.query.address
            },
            headers: {
              'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
              'x-rapidapi-key': '58e3cdfbdfmsh7ddc5f32b36a8a0p1bfd84jsn44883bb6ccee',
              useQueryString: true
            },
            json:true
          };
        request(options, function (error, gg,body) {
            if (error) {
               return res.send({
                    error: "wrong"
                })
            
            }
            else if(body.message){
                return res.send({
                    error: body.message
                })
            }   
            res.send({
                pressure: body.main.pressure,
                location: body.name,
                humidity: body.main.humidity
                                          })
        });
       
    }
   
})
app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error:'you must provide search'
        })
    }
    else{
        console.log(req.query) 
        res.send({
            products: []
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})