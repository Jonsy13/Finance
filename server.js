const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const cors = require("cors");
const knex = require("knex");


let Cid;
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "Jon1311",
    database: "fincalc"
  }
});

/*db.select('*').from('users').then(data =>{
  console.log(data);
});*/

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "j@gmail.com",
      password: "cookies",
      entries: "0",
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "S@gmail.com",
      password: "bananas",
      entries: "0",
      joined: new Date()
    }
  ],

  login: [
    {
      id: "987",
      hash: "",
      email: "j@gmail.com"
    }
  ],

  checks: [
    {
      Present: "1",
      Future: "2",
      Time: "3",
      Interest: "4",
      Amount: "5"
    }
  ]
};

app.get("/", (req, res) => {

  res.send(database.users);
});

app.post("/mychecks", (req, res) => {
  const { id } = req.body;
  
  db.select('*').from('data').where('id','=',id).then(data => {
    //console.log(data);
    res.json(data);
  }).catch(err => res.status(400).json("Unable to fetch data"));
  
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      console.log(user);

      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch(err => res.status(400).json("error getting user"));
  /* if (!found) {
    res.status(400).json("Not Found");
  }*/
});

app.listen(process.env.PORT || 3000 , () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

app.post("/signin", (req, res) => {
  /* bcrypt.compare("apples", '$2b$10$ANL2fwvEMcTswTIo5a2LzeNCOamcipqtVpw7iypjTfbldf0tuOh86', function(err, res) {
        // res == true
        console.log("first guess :",res);
    });
    bcrypt.compare("Veggies",'$2b$10$ANL2fwvEMcTswTIo5a2LzeNCOamcipqtVpw7iypjTfbldf0tuOh86', function(err, res) {
        // res == true
        console.log("second guess :",res );
    });*/
  /*if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error");
  }*/

  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            console.log(user);
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong Credentials");
      }
    })
    .catch(err => res.status(400).json("wrong Credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  var hash = bcrypt.hashSync(password, saltRounds);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("Unable to register"));
});

app.post("/checking", (req, res) => {
  const { Present, Future, Time, Interest, Amount, id } = req.body;
  /*database.checks.push({
    Present: Present,
    Future: Future,
    Time: Time,
    Interest: Interest,
    Amount: Amount
  });*/

  /*db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get entries"));*/

  db.insert({
        id:id,
        present: Present,
        future: Future,
        time: Time,
        interest: Interest,
        amount: Amount
      })
      .into("data")
      .returning("*")
      .then( data => {
        res.json("Query Recorded");
      })
});
/*

/--> res = this is working

/signin --> post = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/Check --> PUT --> MyCheck 

*/
