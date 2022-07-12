const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const utenti = database.collection("utenti")
const carello = database.collection("carello")
var ObjectId = require('mongodb').ObjectId


var insertCarello = async function(req , res) {

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

exports.insertCarello = insertCarello

