const { MongoClient } = require('mongodb')
const uri = 'mongodb://localhost:27017/shop'
const client = new MongoClient(uri)
const database = client.db('shop')
const utenti = database.collection('utenti')
var md5 = require('md5')

const controlLogin = async function (req, res) {
  let result = false
  let users = { }
  try {
    await client.connect()

    const query = { username: req.body.username, password: md5(req.body.password) }
    users = await utenti.findOne(query)

    if (users === null) {
      result = false
    } else {
      result = true
    }
  } finally {
    await client.close()
    if (result === true) {
      res.send({
        entered: true,
        idUtente: users._id
      })
    } else {
      res.status(400).send({
        entered: false,
        idUtente: null
      })
    }
  }
}

exports.controlLogin = controlLogin
