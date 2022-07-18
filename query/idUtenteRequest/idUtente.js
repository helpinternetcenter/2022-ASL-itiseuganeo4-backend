const { MongoClient, ObjectId } = require('mongodb')
const uri = 'mongodb://localhost:27017/shop'
const client = new MongoClient(uri)
const database = client.db('shop')
const utenti = database.collection('utenti')

const viewId = async function (req, res) {
  let user = {}

  try {
    await client.connect()
    const query = { _id: ObjectId(req.query.id) }

    user = await utenti.findOne({ ...query })
    delete user.password
  } finally {
    await client.close()
    res.json(user)
  }
}

exports.viewId = viewId
