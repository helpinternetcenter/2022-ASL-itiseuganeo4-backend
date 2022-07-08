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

/*
    * FUNCTION UTILS
*/

//controllo carello
function ControlCarello( object1 , object2 , object3 , object4 ) {
    let cond = null
 
    if(object1 === object3 && object2 === object4){
        cond = true
    } else {
        cond = false
    }

    return(cond)
}

// controllo username
// controlla la password

function ControlUser( user , user1 ) {
    let control = null

    if( user === user1 ){
        control = true       
    } else {
        control = false
    }

    return(control)
}



/*
    * FUNZIONI ASSINCRONE
*/

//inserimento Utente
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
            control = ControlUser( username , users[i].username)
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

//inserimento Carello
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
            control = ControlCarello(idUtente , idMobile , carts[i].idUtente , carts[i].idMobile)

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


// Controllo per il Login
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


// presa Prodotto Specifico
async function ViewProdotto(req , res) {
    let product = { }
    try {

        await client.connect()

        const query = { ...req.query }

        product = await prodotti.findOne( { ...query } )

    } finally {
        await client.close();
        res.json(product)
    }
}


// Presa Carello per utente e per id
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

// inserimeto Dati di acquisto
async function insertData(req , res , idUtente) {


    let user = { }
    try {

        await client.connect()

        user = await utenti.findOne( { _id: new ObjectId(idUtente) } )

        if(user != null) {
            user = await utenti.replaceOne( 
                { _id: new ObjectId(idUtente) },

                {
                    ...user,
                    indirizzo: req.body.indirizzo,
                    stato: req.body.stato,
                    paese: req.body.paese,
                    provincia: req.body.provincia,
                    modPagamento: req.body.modPagamento
                }
                
            )
            res.send(user)
        } else {
            res.send( 'Utente is not regitered')
        }

    } finally {
        await client.close()
    }
}


// schermata Home
// presa di tutti i prodotti

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

/*
    * RICHIESTA HTTP E RISPOSTE
*/

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

app.post('/DataAcquisto/' , (req , res) => {
    const idUtente = req.query.idUtente
    insertData(req , res , idUtente)
})



app.listen(3000)

