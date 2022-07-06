const express = require('express')
const cors = require('cors')
const{ MongoClient } = require('mongodb')
var ObjectId = require('mongodb').ObjectId; 

const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const utenti = database.collection("utenti")
const carello = database.collection("carello")
const prodotti = database.collection("prodotti")

const app = express()

app.use(cors())
app.use(express.urlencoded( { extended: false } ))
app.use(express.json())

async function insertToDatabase(req , res , collection) {

    try {
        await client.connect();

        result =  await collection.insertOne(req.body)

    } finally {

        res.send("Data insert to database")
        await client.close();
    }
}

async function ControlLogin(req , res){

    let result = false
    let users = []
    try {
        await client.connect();

        const query = { username: req.body.username, pasword: req.body.password}
        const collection = utenti.find(query)

        users = await collection.toArray()

        if(users.length == 0){
            result = false
        }else {
            result = true
        }


    } finally {
        await client.close();
        res.send("Presente: " + result)
        console.log(users)
    }
}

async function ViewProdotto(req , res) {
    let product = { }
    try {

        await client.connect()

        const id = req.params.id

        const query = { idMobile: id }

        product = await prodotti.findOne( query )

    } finally {
        await client.close();
        res.json(product)
    }
}

async function ViewCarello(req , res , collection , query) {
    let products = []
    try {

        await client.connect()

        const riepilogo =  collection.find( query )
        
        products = await riepilogo.toArray()

    } finally {
        await client.close();
        res.json(products)
    }
}

async function ViewLogin(req , res){
    let  utente = { }
    try {

        await client.connect()

        const idUtente = req.query.idUtente
        var o_id = new ObjectId(idUtente)

        console.log(idUtente)

        utente = await utenti.findOne( { _id: o_id } )


    } finally {
        res.send( utente )
        await client.close()
    }
}

async function ViewAll(){
    let products = []
    try {

        await client.connect()

        const query = { }

        const riepilogo =  collection.find( query )
        
        products = await riepilogo.toArray()

    } finally {
        await client.close();
        res.json(products)
    }
}



app.post('/Registrazione' , (req , res) => {
    insertToDatabase(req , res , utenti).catch(console.dir)
})

app.post('/Login' , (req , res) => {
    ControlLogin(req , res).catch(console.dir)
})

app.post('/Carello/inserimento' , (req , res) => {
    insertToDatabase(req , res , carello ).catch(console.dir)
})

app.get('/Carello/' , (req , res) => {
    const query = { ...req.query }
    ViewCarello(req , res , carello ,query).catch(console.dir)

})

/*
app.get('/Carello/' , (req , res) => {
    const query = { idUtente: req.query.idUtente , idMobile: req.query.idMobile }
    console.log(query)
    ViewCarello(req , res , carello , query).catch(console.dir)

})
*/

app.get('/Prodotto/:id' , (req , res) => {
    ViewProdotto(req , res).catch(console.dir)
})

app.get('/Prodotto/all' , (req , res) => {
    ViewAll(req , res , prodotti).catch(console.dir)
})

app.get('/Login/' , (req , res) => {
    ViewLogin(req , res).catch(console.dir)
})

app



app.listen(3000)

