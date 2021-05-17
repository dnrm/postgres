require('dotenv').config();
const { Client, Pool } = require("pg");
const app = require("express")();
const request = require("request");

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

client.connect();

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
    await client.query("SELECT * FROM dnrm", (err, response) => {
        if (!err) {
            res.send(response.rows);
        } else {
            res.send(err);
        }
    });
});

app.listen(9090, () => console.log(`http://localhost:9090`));
