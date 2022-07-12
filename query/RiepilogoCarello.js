const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const carello = database.collection("carello")
const { Research } = require('../Utilis')

var ViewCarello = async function ( req , res ) {

    let riepilogo = []
    let products = []

    try {

        await client.connect()

        riepilogo =  carello.find( { idUtente: req.query.idUtente } )
        
        riepilogo = await riepilogo.toArray()

        riepilogo.forEach((item) => {
            products.push(Research(item))
        })

        Promise.all(products).then((values) => {
            res.send(values)
        })

    } finally {
        await client.close();
    }
}

exports.ViewCarello = ViewCarello