const{ MongoClient } = require('mongodb')
const uri = "mongodb://localhost:27017/shop"
const client = new MongoClient(uri)
const database = client.db("shop")
const prodotti = database.collection("prodotti")


//ricerca tramite idUtente
var Research = async function ( item , data , ora ) {

        var prodotto = await prodotti.findOne( { idMobile: item.idMobile } )
        const { linkImmagini , prezzo , nomeMobile , descrizioneMobile } = prodotto
        prodotto = {
            nomeMobile: nomeMobile,
            image: linkImmagini[0],
            descrizione: descrizioneMobile,
            prezzo: prezzo,
            ora: ora,
            data: data,
            quantita: item.quantita 
        }
        return( prodotto )
}


// controllo username
var ControlUser = function( user , user1) {
    let control = null

    if( user === user1 ){
        control = true       
    } else {
        control = false
    }

    return(control)
}

exports.Research = Research
exports.ControlUser = ControlUser
