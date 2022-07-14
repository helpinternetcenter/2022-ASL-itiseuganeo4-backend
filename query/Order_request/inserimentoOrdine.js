const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const utenti = database.collection("utenti")
const carello = database.collection("carello")
const ordini = database.collection("ordini")
const utils = require('../../Utils/Utilis')
var ObjectId = require('mongodb').ObjectId; 

const insertOrdine = async function ( req , res ) {
    let utente = { }
    let lista = [ ]
    let acquisti = [ ]
    const { idUtente } = req.query
    const data = new Date()

    try {
        await client.connect()

        utente = await utenti.findOne({ _id: new ObjectId(idUtente)})
        acquisti = carello.find({ idUtente: idUtente })
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
            if(utils.isDataEmpty(utente)){
                res.status(404).send("Data was not inserted to information's Utente")
            } else {
                await ordini.insertOne({
                    ordini: lista,
                    idUtente: idUtente,
                    indirizzo: utente.indirizzo,
                    stato: utente.stato,
                    paese: utente.paese,
                    ore: data.toLocaleTimeString(),
                    data: data.toLocaleDateString()
                })   
                await carello.deleteMany( { idUtente: idUtente  })
                res.status(200).send('You have just done a new order')
            }
        }

    } finally {
        await client.close();
    }
}

exports.insertOrdine = insertOrdine