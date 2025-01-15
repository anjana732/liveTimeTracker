var catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error')

async function encryptPassword(){
    
}

async function handleForgotPassword(req, res){

}

async function handleAdminLogin(req, res) {

    const { email, password } = req.body
    var app = catalyst.initialize(req);
   

}

module.exports = {
    handleAdminLogin
}