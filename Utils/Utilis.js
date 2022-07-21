const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017/shop'
const client = new MongoClient(uri)
const database = client.db('shop')
const prodotti = database.collection('prodotti')

const research = async function (item) {
  var prodotto = await prodotti.findOne({ idMobile: item.idMobile })
  const { linkImmagini, prezzo, nomeMobile, descrizioneMobile } = prodotto
  const { quantita, indirizzo, ore, data, stato, paese } = item

  prodotto = {
    nomeMobile: nomeMobile,
    image: linkImmagini[0],
    descrizione: descrizioneMobile,
    prezzo: prezzo,
    quantita: quantita,
    indirizzo: indirizzo,
    ore: ore,
    data: data,
    stato: stato,
    paese: paese
  }
  return (prodotto)
}

const isDataEmpty = function (utente) {
  let value = false
  const { stato, paese, indirizzo } = utente
  if (stato === undefined || paese === undefined || indirizzo === undefined) {
    value = true
  } else {
    value = false
  }

  return (value)
}

exports.research = research
exports.isDataEmpty = isDataEmpty
