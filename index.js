const express = require('express')
const cors = require('cors')
const app = express()
const { Request } = require('./query')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/Registrazione', (req, res) => { Request.insertUsers(req, res) })

app.post('/Login', (req, res) => { Request.controlLogin(req, res) })

app.post('/Carello/inserimento', (req, res) => { Request.insertCarello(req, res) })

app.get('/Carello/', (req, res) => { Request.viewCarello(req, res) })

app.get('/Prodotto/', (req, res) => { Request.viewProdotto(req, res) })

app.get('/Home', (req, res) => { Request.home(req, res) })

app.post('/DataAcquisto/', (req, res) => { Request.insertData(req, res) })

app.post('/Ordini/', (req, res) => { Request.insertOrdine(req, res) })

app.get('/Ordine/', (req, res) => { Request.viewOrdini(req, res) })

app.listen(3000)
