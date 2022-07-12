const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const prodotti = database.collection("prodotti")


//ricerca tramite idUtente
const research = async function ( item , data , ora ) {

        var prodotto = await prodotti.findOne( { idMobile: item.idMobile } )
        const { linkImmagini , prezzo , nomeMobile , descrizioneMobile } = prodotto
        prodotto = {
            nomeMobile: nomeMobile,
            image: linkImmagini[0],
            descrizione: descrizioneMobile,
            prezzo: prezzo,
            ora,
            data,
            quantita: item.quantita 
        }
        return( prodotto )
}

exports.research = research
