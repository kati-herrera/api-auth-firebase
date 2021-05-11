const firebase = require('firebase');
const admin = require("firebase-admin");

async function authorize(request, response, next) {
    try {
        if (request.body.token) {
            await firebase.auth().signInWithCustomToken(request.body.token); //validar si hay token
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    next();
                }
            });
        } else {
            console.log('No token')
            throw new Error('Forbidden');
        }
    }
    catch (error) {
        response.status(400).send({ message: 'Error sign in user' })
        next(new Error({ message: 'Error sign in user' }));
    }
}

module.exports = authorize;

