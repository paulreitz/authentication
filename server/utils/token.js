const jwt = require('jsonwebtoken');

function getAccountToken(data) {
    let accountData = {
        success: true,
        id: data.id,
        userName: data.user_name,
        displayName: data.name,
        createdAt: data.created_at
    };
    const token = jwt.sign(accountData, process.env.SECRET);
    accountData.token = token;
    return accountData;
}

function verifyToken(header) {
    let token = header.split(' ')[1];
    let dataObject;
    try {
        dataObject = jwt.verify(token, process.env.SECRET);
    }
    catch(err) {
        dataObject = null;
    }
    return dataObject;
}

function getUserToken(data) {
    let userData = {
        success: true,
        project: data.project_id,
        userKey: data.user_key,
        userName: data.user_name,
        role: data.role, 
        createdAt: data.created_at
    }
    const token = jwt.sign(userData, process.env.SECRET);
    userData.token = token;
    return userData;
}

function verifyUserToken(token) {
    let dataObject;
    try {
        dataObject = jwt.verify(token, process.env.SECRET);
    }
    catch(err) {
        dataObject = null;
    }
    return dataObject;
}

module.exports = {
    getAccountToken,
    verifyToken,
    getUserToken,
    verifyUserToken
}