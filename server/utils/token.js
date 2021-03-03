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

module.exports = {
    getAccountToken
}