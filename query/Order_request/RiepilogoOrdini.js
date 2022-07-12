const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const ordini = database.collection("ordini")
const { research } = require('../../Utilis')

const viewOrdini = async function ( req , res ){

    let products = []
    let orders = []
    const { idUtente } = req.query
    try {

        await client.connect()

        orders = ordini.find( { idUtente: idUtente} )
        orders = await orders.toArray()

        orders.forEach((order) => {
            order.ordini.forEach((item) => {
                products.push(research(item , order.data , order.ore))
            })
        })

        Promise.all(products).then((values) => {
            res.send(values)
        })

    } finally {
        await client.close()
    }
}

exports.viewOrdini = viewOrdini