const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require ('dotenv');

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());

const kittySchema = new mongoose.Schema({
    name: String   
});
kittySchema.methods.speak = () => {
    const greeting = this.name ? 'My name is ${this.name}' : 'I have no name((';
    console.log(greeting);
}

const Kitten = mongoose.model('Kitten', kittySchema);

app.post('/createCat', async (req, res) => {
    const name = req.body.name;
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, async (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        const cat = new Kitten({ name: name });

        await cat.save((err, cat) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }

            console.log('Cat created.');
            cat.speak();
        });

        res.sendStatus(201);
    })
});

app.get('/findCat', async (req, res) => {
    const name = req.body.name;
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, async (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        await Kitten.find({name: name}, (err, cat) => {
            if (err) {
                console.error(err);
                return res.sendStatus(404);
            }
            console.log(cat);
            res.status(201).json({cat});
        });
    });
});


app.listen(PORT, () => console.log('App is running on port: ${PORT}.'));