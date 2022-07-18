const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017/shop'
const client = new MongoClient(uri)
const database = client.db('shop')
const utenti = database.collection('utenti')

const md5 = require('md5')

const insertUsers = async function (req, res) {
  let user = { }
  try {
    await client.connect()
    let { nome, cognome, username, password } = req.body
    password = md5(password)
    user = await utenti.findOne({ username: username })

    if (user === null) {
      if (nome === '' || cognome === '' || username === '' || password === '') {
        res.send({
          result: false,
          response: 'Campi obbligatori'
        })
      } else {
        await utenti.insertOne({
          nome: nome,
          cognome: cognome,
          username: username,
          password: password
        })
      }
      res.send({
        result: true,
        text: ''
      })
    } else {
      res.send({
        result: false,
        text: 'username gia inserito'
      })
    }
  } finally {
    await client.close()
  }
}

exports.insertUsers = insertUsers
