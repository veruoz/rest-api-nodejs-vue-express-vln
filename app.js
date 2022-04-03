const express = require('express')
const { log } = require("nodemon/lib/utils");
const path = require('path')
const { request } = require("express");
const app = express()

const CONTACTS = [
    { id: 1, name: 'Михаил', value: '+79151112526', marked: false }
]

// создаем ендпоинт GET
app.get('/api/contacts', (req, res) => {
    setTimeout(() => {
    res.status(200).json(CONTACTS)
    }, 1000)
})

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (req, res) => {
    res.sendFile((path.resolve(__dirname, 'client', 'index.html')))
})

app.listen(3000, () => console.log('server started'))
