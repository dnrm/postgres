require('dotenv').config();
const { Client, Pool } = require("pg");
const express = require('express');
const app = express();
const request = require("request");
const cors = require('cors');
const PORT = process.env.PORT || 9090;

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

client.connect();

app.use(cors({
    origin: '*',
}));
app.use(express.json())

app.get("/", async (req, res) => {
    request.get(
        "https://goquotes-api.herokuapp.com/api/v1/random?count=1",
        (err, response, body) => {
            res.send({
                message: "Hello!",
                easterEgg: JSON.parse(body).quotes[0].text,
            });
        }
    );
});

app.get("/users", async (req, res) => {
    try {
        await client.query("SELECT * FROM dnrm", (err, response) => {
            if (!err) {
                res.send(response.rows);
            } else {
                res.send(err);
            }
        });
    } catch (e) {
        console.log(e)
        res.send(e);
    }
});

app.post('/user/:id', async (req, res) => {

    let { password, username, email, id } = req.body;
    let values = [password, username, email, id];
    let query = `UPDATE dnrm SET password = $1, username = $2, email = $3 WHERE id = $4;`;

    try {
        let result = await client.query({
            rowMode: 'array',
            text: query,
            values
        })
        res.set({
            'Set-Cookie': `password=${password}; Secure; HttpOnly; Max-Age: 100`
        })
        res.send(result.rows);
    } catch (e) {
        res.set({
            'x-dnrm': 'that aint right O_o',
        })
        res.status(500).send({
            message: "Internal server error",
            status: 500,
            ts: new Date().getTime()
        })
    }
})

app.listen(PORT, () => console.log(`http://localhost${PORT == 80 ? '/' : `:${PORT}/`}`));
