const admin = require("firebase-admin");
var crypto = require('crypto');

//Create custom Token
async function createCustomTokenUser(uid, secret, next) {
    if (uid) {
        let userRecord = await admin.auth().getUser(uid);
        console.log(userRecord.customClaims.secret)
        if (secret && userRecord.customClaims.secret === secret) {
            return await admin.auth().createCustomToken(uid);
        } else {
            next();
        }
    } else {
        next();
    }
}

// Add custom claims to user
async function addCustomClaimsToUser(uid) {
    claims = {
        secret: crypto.randomBytes(20).toString('base64'),
        adminSchools: [
            'littera'
        ]
    }
    console.log(claims)
    return await admin.auth().setCustomUserClaims(uid, claims)
}

// Return one user
function getOnlyUser(uid) {
    admin.auth().getUser(uid).then((userRecord) => {
        console.log(userRecord)
        return userRecord.uid;
    }).catch((err) => {
        console.error('Error fetching user data: ', err);
    })
}


// Return all users
function getAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
        .then(function (listUsersResult) {
            listUsersResult.users.forEach(function (userRecord) {
                console.log('user', userRecord.toJSON());
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken);
            }
        })
        .catch(function (error) {
            console.log('Error listing users:', error);
        });
}



module.exports = {
    createCustomTokenUser,
    addCustomClaimsToUser,
    getOnlyUser,
    getAllUsers
}