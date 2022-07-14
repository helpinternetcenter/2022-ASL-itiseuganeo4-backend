const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const prodotti = database.collection("prodotti")

const viewProdotto = async function( req , res ) {
    let product = { }
    try {

        await client.connect()

        const query = { idMobile: req.query.idMobile }

        product = await prodotti.findOne( { ...query } )

    } finally {
        await client.close();
        res.json(product)
    }
}

exports.viewProdotto = viewProdotto