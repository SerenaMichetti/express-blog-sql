console.log("Welcome blog world")

const express = require('express')

//importo il router posts
const postsRouter = require("./routers/posts")

//importo il middleware routeNotFound per verificare se una rotta è esistente
const routeNotFound = require("./middlewares/routeNotFound")

//importo il middleware errorsHandler per gestire gli errori interni del server 
const errorsHandler = require("./middlewares/errorsHandler")

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json());



//rotta base con hello world
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//richiamo la variabile posts router e inserisco il prefisso /posts
app.use("/posts", postsRouter)

//se nessuna rotta è stata trovata, allora eseguo il middleware routeNotFound
app.use(routeNotFound);

//se si verifica un errore interno del server, allora eseguo il middleware errorsHandler
app.use(errorsHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})