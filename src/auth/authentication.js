const firebase = require('firebase');
const admin = require("firebase-admin");

async function authorize(request, response, next) {
    try {
        let userRecord = await admin.auth().getUser(request.body.uid);
        console.log({userRecord})
        if (userRecord.customClaims.secret === request.body.secret) {
            await firebase.auth().signInWithCustomToken(request.body.token);
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                   // user.getIdTokenResult().then(function (data) {
                        //    console.log("Data: ", data.claims)
                    //     if (data.claims.littera === 'Littera') {
                    //   //  if (data.claims.adminSchools.includes(request.body.school)) {
                    //         console.log("You have access to modificate the info")
                    //         response.status(200).send({ message: 'You have access to modificate the info' })
                    //     } else {
                    //         console.log("You do not have access to modificate the info")
                    //         //s response.status(403).json({ message: "Forbidden" });
                    //         response.status(403).send({ message: 'You DONT have access to modificate the info' })
                    //     }
                    next();
                   // });
                }
            });
        } else {
            throw new Error('Forbidden');
        }
    }
    catch (error) {
        console.log("Error sign in user: ", error)
        response.status(400).send({ message: 'Error sign in user' })
    }
}

module.exports = authorize;

