const express = require("express")
const router = express.Router()
const { requiresAuth } = require("express-openid-connect")
const axios = require("axios");

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    res.render("home", {
        title: "Express",
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})



router.get("/secrets", requiresAuth(), async (req, res) => {
    let data = {}
    
    const { token_type, access_token } = req.oidc.accessToken

    try {
        const apiResponse = await axios.get("http://localhost:5000/private", 
        {
            headers:{
                authorization: `${token_type} ${access_token}`
            }
        })
        data = apiResponse.data
    } catch (e) {}

    res.render("secrets", {
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        data: data,
        token: access_token
    })
})

router.get("/submit", requiresAuth(), (req, res) => {
    res.render("submit", {
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})


module.exports = router