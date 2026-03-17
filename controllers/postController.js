const dbConnection = require('../data/db');

//creo una funzione di index che restituisce tutti i post
function index(req, res) {

    const sqlQuery = 'SELECT * FROM posts';

    dbConnection.query(sqlQuery, (error, rows) => {

        if (error) {
            return res.status(500).json({ error: 'DB error', message: 'Errore nel recuperare i date dal db' })
        }

        let results = rows;

        //se sono presenti dei query tags, filtro il risultato in base ai tag
        // if (req.query.tags) {

        //     results = rows.filter(post => post.tags.includes(req.query.tags))
        // }

        res.json(results);
    });

}

//creo una funzione di showche restituisce un post in base all'id, se l'id non è un numero restituisce un errore 400, se l'id non esiste restituisce un errore 404
function show(req, res) {

    //se l'id non è un numero restituisco un errore 
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'User error', message: 'L\'ID deve essere un numero' })
    }

    // la prima query per trovare il Post per id
    const sqlQuery = 'SELECT * FROM posts WHERE id = ?';

    // la seconda query per trovare i tags relativi al post trovato con la prima query
    const relationQuery = `SELECT tags.label
    FROM tags
    JOIN post_tag 
    ON tags.id = post_tag.tag_id
    WHERE post_tag.post_id = ?`

    // il parametro di entrambe le query è l'id del post 
    const parametriQuery = [id];

    // cerco il Post tramite query 
    dbConnection.query(sqlQuery, parametriQuery, (error, results) => {

        //gestisco il caso in cui la query di ricerca del Post va in errore
        if (error) {
            return res.status(500).json({ error: "DB error", message: `Errore nel recuperare il post con id ${id} dal db` })
        }

        //gestisco il caso in cui non ottengo Post
        if (results.length === 0) {
            return res.status(404).json({ error: "Not Found", message: `Post con id ${id} non trovato` })
        }

        // se ho ottenuto il Post 
        // lo metto in una variabile 
        const post = results[0]

        // cerco i suoi Tags tramite un'altra query
        dbConnection.query(relationQuery, parametriQuery, (error, results) => {

            // se la query di estrazione Tags va in errore
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "DB error", message: `Errore nel recuperare i tag del post con id ${id}` });
            }

            // se ho ottenuto i tags 
            const tags = results;

            // li metto nel Post che avevo trovato in precedenza 
            post.tags = tags;

            // restituisco la risposta che comprende il Post con i suoi Tags 
             res.json(post);

        })

    })

}

//creo una funzione di destroy che elimina un post in base all'id
function destroy(req, res) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "User error", message: "L'ID deve essere un numero" });
    }

    const sqlQuery = "DELETE FROM posts WHERE id = ?";

    const parametriQuery = [id];

    dbConnection.query(sqlQuery, parametriQuery, error => {
        if (error) {
            return res.status(500).json({ error: 'DB error', message: 'Impossibile eliminare il post con id ${id}' })
        }

        return res.sendStatus(204);
    })


}

// creo una funzione di store che crea un nuovo post, se il post viene creato con successo restituisce un messaggio di successo e il post creato e lo aggiunge all'array dei post

// {
//     "title": "I segreti del caffè perfetto a casa",
//     "content": "Dalla scelta della miscela alla temperatura dell'acqua: tutto quello che devi sapere per un espresso da bar nella tua cucina.",
//     "image": "https://caffecorsini.com/cdn/shop/articles/Header_4880cdaa-2199-4bef-9bfc-cf48126fcea0.png?crop=center&height=1200&v=1762180232&width=1200",
//     "tags": [
//         "lifestyle",
//         "caffè",
//         "consigli"
//     ]
// }

function store(req, res) {

    const newPost = {
        id: posts[posts.length - 1].id + 1,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }
    console.log("Ricevuta la seguente richiesta:", req.body)
    posts.push(newPost);
    return res.status(201).json(newPost);
}
// creo una funzione di update che modifica completamente un post in base all'id, se l'id non è un numero restituisce un errore 400, se l'id non esiste restituisce un errore 404, 
// se il post viene modificato con successo restituisce un messaggio di successo e il post modificato

function update(req, res) {
    //res.send(`hai richiesto di modificare completamente il post con id: ${req.params.id}`);

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "User error", message: "L'id non è valido" });
    }

    const result = posts.find(post => post.id == id);

    if (!result) {
        return res.status(404).json({ error: "Not Found", message: "Post non trovato" });
    }

    result.title = req.body.title ?? result.title;
    result.content = req.body.content ?? result.content;
    result.image = req.body.image ?? result.image;
    result.tags = req.body.tags ?? result.tags;

    console.log(`Post con id ${id} modificato`);
    console.log(result);
    return res.json(result);
};

// creo una funzione di modify che modifica parzialmente un post in base all'id, se l'id non è un numero restituisce un errore 400, se l'id non esiste restituisce un errore 404
function modify(req, res) {
    //res.send(`Hai richiesto di modificare parzialmente il post con id: ${req.params.id}`);

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "User error", message: "L'id non è valido" });
    }

    const result = posts.find(post => post.id == id);

    if (!result) {
        return res.status(404).json({ error: "Not Found", message: "Post non trovato" });
    }


    if (req.body.title !== undefined) {
        result.title = req.body.title;
    }
    if (req.body.content !== undefined) {
        result.content = req.body.content;
    }
    if (req.body.image !== undefined) {
        result.image = req.body.image;
    }
    if (req.body.tags !== undefined) {
        result.tags = req.body.tags;
    }

    console.log(`Post con id ${id} modificato`);

    return res.json(result);
};

const crudController = {
    index,
    show,
    destroy,
    store,
    update,
    modify
}
module.exports = crudController