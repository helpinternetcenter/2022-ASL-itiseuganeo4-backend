const {Home} = require('./query/Home')
const {insertData} = require('./query/Data')
const {insertCarello} = require('./query/InserimentoCarello')
const {insertOrdine} = require('./query/InserimentoOrdine')
const {ControlLogin} = require('./query/Login')
const {ViewProdotto} = require('./query/Prodotto')
const {insertUsers} = require('./query/Registrazione')
const {ViewCarello} = require('./query/RiepilogoCarello')
const {ViewOrdini} = require('./query/RiepilogoOrdini')

const Request = {
    Home,
    insertData,
    insertCarello,
    insertOrdine,
    ControlLogin,
    ViewProdotto,
    insertUsers,
    ViewCarello,
    ViewOrdini
}

exports.Request = Request