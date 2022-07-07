const express = require('express')
const cors = require('cors')
const{ MongoClient } = require('mongodb')
var ObjectId = require('mongodb').ObjectId; 
var md5 = require('md5')

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

function ControlObject( object1 , object2 , object3 , object4 ) {
    let cond = null
 
    if(object1 === object3 && object2 === object4){
        cond = true
    } else {
        cond = false
    }

    return(cond)
}

async function insertUsers(req , res) {
    let control = false

    let users = []
    try {

        await client.connect()

        let { username , password } = req.body

        password = md5(password)

        users =  utenti.find( { } )

        users = await users.toArray()

        for(let i in users ){
            control = ControlObject(username , password , users[i].username , users[i].password)
            if(control == true){
                break
            }
        }
        
        if(control == false) {
            await utenti.insertOne( { username: username , password: password } )
            res.send('Utente insert to Database')
        }
        else {
            res.send('Utente already exist')
        }


    } finally {
        await client.close();
    }
}

async function insertCarello(req , res) {

    let control = false
    let carts = []
    let cart = { }
    try {
        await client.connect();

        let { idUtente , idMobile } = req.body

        carts =  carello.find( {  } )

        carts = await carts.toArray()


        for(let i in carts ){
            control = ControlObject(idUtente , idMobile , carts[i].idUtente , carts[i].idMobile)

            if(control === true) {
                cart = { idUtente: idUtente , idMobile: idMobile , quantita: carts[i].quantita + req.body.quantita }
                await carello.deleteMany( carts[i] )
                await carello.insertOne( cart )
            }
        }

        if(control === false) {
            await carello.insertOne( req.body )
        }

    } finally {

        res.send("Data insert to database")
        await client.close();
    }
}

async function ControlLogin(req , res){

    let result = false
    let users = { }
    try {
        await client.connect();

        const query = { username: req.body.username, password: md5(req.body.password) }
        users = await utenti.findOne( query )

        if(users === null) {
            result = false
        } else {
            result = true
        }


    } finally {
        await client.close();
        if (result === true){
            res.send('Welcome to Project z')
        } else {
            res.status(400).send('Users is not registered')
        }

        console.log(users)
    }
}

async function ViewProdotto(req , res) {
    let product = { }
    try {

        await client.connect()

        const query = { ...req.query }

        product = await prodotti.findOne(query)

    } finally {
        await client.close();
        res.json(product)
    }
}

async function ViewCarello(req , res , query) {

    let informationProducts = []
    let products = []
    let prodotto = { }

    try {

        await client.connect()

        let riepilogo =  carello.find( query )
        
        informationProducts = await riepilogo.toArray()

        for(i = 0 ; i < informationProducts.length ; i++){
            prodotto = await prodotti.findOne( { idMobile: informationProducts[i].idMobile } )
            prodotto =  { 
                nomeMobile: prodotto.nomeMobile,
                prezzo: prodotto.prezzo,
                descrizioneMobile: prodotto.descrizioneMobile,
                immagine: prodotto.linkImmagini[0],
                quantita: informationProducts[i].quantita
            }
            products.push(prodotto)
        }

        res.send(products)

    } finally {
        await client.close();
    }
}

/*
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
*/

async function ViewAll(req , res , collection){
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
    insertUsers(req , res , utenti).catch(console.dir)
})

app.post('/Login' , (req , res) => {
    ControlLogin(req , res).catch(console.dir)
})

app.post('/Carello/inserimento' , (req , res) => {
    insertCarello(req , res).catch(console.dir)
})

app.get('/Carello/' , (req , res) => {
    const query = { ...req.query }
    ViewCarello(req , res  , query).catch(console.dir)

})
app.get('/Prodotto/' , (req , res) => {
    ViewProdotto(req , res).catch(console.dir)
})

app.get('/Home' , (req , res) => {
    ViewAll(req , res , prodotti).catch(console.dir)
})


app.get('/Data/Inserimento/' , (req , res) => {

} )



app.listen(3000)

