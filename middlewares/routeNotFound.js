function routeNotFound(req, res, next) {
    console.log('routeNotFound');
    res.status(404).json({ error: "Not Found", message: "Rotta non trovata" })

}

module.exports = routeNotFound;