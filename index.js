const express = require('express')
const cors = require('cors')
const{ MongoClient } = require('mongodb')
const {Research , ControlUser } = require('./Utilis')
var ObjectId = require('mongodb').ObjectId; 
var md5 = require('md5')


const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const utenti = database.collection("utenti")
const carello = database.collection("carello")
const prodotti = database.collection("prodotti")
const ordini = database.collection("ordini")

const app = express()

app.use(cors())
app.use(express.urlencoded( { extended: false } ))
app.use(express.json())

/*
    * FUNZIONI ASSINCRONE
*/

//inserimento Utente
async function insertUsers(req , res) {
    let control = false

    let users = []
    try {

        await client.connect() 

        let { nome , cognome , username , password } = req.body

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
            await utenti.insertOne( {
                nome: nome,
                cognome: cognome,
                username: username, 
                password: password,
            } )
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

    let cart = { }
    let utente = null
    try {
        
        await client.connect();

        let { idUtente , idMobile } = req.body

        utente = await utenti.findOne(
            { _id: new ObjectId(idUtente) } 
        )
        

        if(utente != null){

            cart = await carello.findOne( { 

                idUtente: idUtente, 
                idMobile: idMobile 
            } )

            if( cart != null ){

                await carello.updateOne ( 

                    {  
                        idUtente: idUtente,
                        idMobile: idMobile  
                    },
                    {
                        $set: {
                            quantita: cart.quantita + req.body.quantita
                        }
                    }
                )
                res.status(200).send('update carello')

            } else {

                await carello.insertOne( req.body )
                res.status(200).send(' new carello insert to Database')
            }

        } else {
            res.status(404).send('Utente not exist')
        }

    } finally {
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

//Schermata per gli oridini
//presenta tutti gli ordini effettuati

async function insertOrdine ( res , id) {
    let utente = { }
    let lista = [ ]
    let acquisti = [ ]

    const data = new Date()

    try {
        await client.connect()

        utente = await utenti.findOne({ _id: new ObjectId(id)})
        acquisti = carello.find({ idUtente: id })
        acquisti = await acquisti.toArray()

        acquisti.forEach((item) => {
            const { idMobile , quantita } = item
            lista.push({ 
                idMobile: idMobile, 
                quantita: quantita, 
            })
        })

        if((lista.length) === 0){
            res.status(404).send('Carello is empty')
        } else {
            await ordini.insertOne({
                ordini: lista,
                idUtente: id,
                indirizzo: utente.indirizzo,
                stato: utente.stato,
                paese: utente.paese,
                ore: data.toLocaleTimeString(),
                data: data.toLocaleDateString()
            })
            await carello.deleteMany( { idUtente: id })
            res.status(200).send('You have just done a new order')
        }

    } finally {

        await client.close();
    }
}

//ViualizzaProdotto

async function ViewProdotto(res, idUtente) {

    let products = []
    let orders = []
    try {

        await client.connect()

        orders = ordini.find( { idUtente: idUtente} )
        orders = await orders.toArray()

        orders.forEach((order) => {
            order.ordini.forEach((item) => {
                products.push(Research(item , order.data , order.ore))
            })
        })

        Promise.all(products).then((values) => {
            res.send(values)
        })

         
    } finally {
        await client.close()
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

app.post('/Ordini/' , (req , res) => {
    const idUtente = req.query.idUtente
    insertOrdine( res , idUtente).catch(console.dir)
})

app.get('/Ordine/' , (req , res) => {
    ViewProdotto( res , req.query.idUtente ).catch(console.dir)
})



app.listen(3000)

