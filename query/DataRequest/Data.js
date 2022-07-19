const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017/shop'
const client = new MongoClient(uri)
const database = client.db('shop')
const utenti = database.collection('utenti')
var ObjectId = require('mongodb').ObjectId

const insertData = async function (req, res) {
  console.log(req)
  let user = { }
  const { idUtente } = req.query
  try {
    await client.connect()
    user = await utenti.findOne({ _id: new ObjectId(idUtente) })
    if (user != null) {
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
      console.log(user)
      res.send(user)
    } else {
      res.send('Utente is not regitered')
    }
  } finally {
    await client.close()
  }
}

exports.insertData = insertData
