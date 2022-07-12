const {home} = require('./HomeRequest/Home')
const {insertData} = require('./DataRequest/Data')
const {insertCarello} = require('./Car_request/InserimentoCarello')
const {insertOrdine} = require('./Order_request/inserimentoOrdine')
const {controlLogin} = require('./Login_request/Login')
const {viewProdotto} = require('./ProdottoRequest/Prodotto')
const {insertUsers} = require('./Registrazione_request/Registrazione')
const {ViewCarello} = require('./Car_request/RiepilogoCarello')
const {viewOrdini} = require('./Order_request/RiepilogoOrdini')

const Request = {
    home,
    insertData,
    insertCarello,
    insertOrdine,
    controlLogin,
    viewProdotto,
    insertUsers,
    ViewCarello,
    viewOrdini
}

exports.Request = Request