// the main app file
const express = require("express");
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const authentication = require('./auth/authentication');
const { createCustomTokenUser,
    addCustomClaimsToUser,
    getOnlyUser,
    getAllUsers } = require('./users/users-controller');

var firebase = require('firebase');

firebase.initializeApp({
    apiKey: "AIzaSyAKm8XR8JiAcYlgr3sgvbbjZkWJ8FfBxF8",
    authDomain: "auth-test-8e841.firebaseapp.com",
    projectId: "auth-test-8e841",
    storageBucket: "auth-test-8e841.appspot.com",
    messagingSenderId: "423962875278",
    appId: "1:423962875278:web:b0112994f9866297f540df",
    measurementId: "G-1VMG6S308G"
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const port = 3000
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Routes for role with littera Middleware 
app.post('/users/private', authentication, (req, res) => {
    res.status(200).send({ message: 'Work' })
});

// Routes to actions
app.post('/user/create-custom-tokens', (req, res) => {
    // validar el error aca
    createCustomTokenUser(req.body.uid, req.body.secret).then(customToken => {
        res.json({
            customToken
        })
    }).catch(err => {
        res.status(400).send({error: 'Forbidden'})
    })
});

app.post('/user/add-custom-claims', (req, res) => {
    addCustomClaimsToUser(req.body.uid).then(() => {
        res.json({
            message: 'Claims added'
        })
    }).catch(err => {
        res.status(400).send('Error: ', err)
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})