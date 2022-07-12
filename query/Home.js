const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const prodotti = database.collection("prodotti")

var Home = async function (req , res ){
    let products = []
    try {
        await client.connect()

        const riepilogo =  prodotti.find( { } )
        
        products = await riepilogo.toArray()

    } finally {
        await client.close();
        res.json(products)
    }
}

exports.Home = Home