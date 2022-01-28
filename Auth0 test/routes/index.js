const express = require("express")
const router = express.Router()
const {
    requiresAuth
} = require("express-openid-connect")

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    res.render("home", {
        title: "Express",
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})



router.get("/secrets", requiresAuth(), (req, res) => {
    res.render("secrets", {
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})

router.get("/submit", requiresAuth(), (req, res) => {
    res.render("submit", {
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user
    })
})


module.exports = router