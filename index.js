const express = require('express')
const cors = require('cors')
const app = express()
const {Request} = require('./Request')

app.use(cors())
app.use(express.urlencoded( { extended: false } ))
app.use(express.json())



app.post('/Registrazione' , (req , res) => { Request.insertUsers( req  , res)})

app.post('/Login' , (req , res) => { Request.ControlLogin( req , res)})

app.post('/Carello/inserimento' , (req , res) => { Request.insertCarello( req , res )})

app.get('/Carello/' , (req , res) => { Request.ViewCarello( req , res)})

app.get('/Prodotto/' , (req , res) => { Request.ViewProdotto( req , res )})

app.get('/Home' , (req , res) => { Request.Home(req , res)})

app.post('/DataAcquisto/' , (req , res) => { Request.insertData(req , res) })

app.post('/Ordini/' , (req , res) => { Request.insertOrdine( req , res )})

app.get('/Ordine/' , (req , res) => { Request.ViewOrdini ( req , res )})


app.listen(3000)

