import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import routers from './routes/routes.js'
import dbCon from "./utlis/db.js";
import UserModel from "./models/Users.js";
import ProgramModel from "./models/Program.js";
import Stripe from 'stripe';



dotenv.config()
const app = express()
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
// const stripe = new Stripe('sk_test_51OgII1FhlO3bVzIRERiiLa7kT0i77iI0jPVVgA9Otsj3uQbycPpIz34ag7VXY11TSlmFKvFf7jDrjS5EZM0oEE2a00AKADiInL');
dbCon()
app.use(cors())
app.use(express.json())
app.use('/api', routers)

// server.js or the relevant backend file
// TODO: create function that will pass success message that will trigger update parents' registration
app.post('/create-checkout-session', async (req, res) => {
    const { lineItems, successUrl, cancelUrl, bookingID, child1Amount, child1Amount2, child2Amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'subscription',  // Ensure the mode is set to subscription
            allow_promotion_codes: true, // Enable usage of promotion codes
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingID}&child1Amount=${child1Amount}&child1Amount2=${child1Amount2}&child2Amount=${child2Amount}`,
            cancel_url: cancelUrl,
        });

        res.status(200).json({ id: session.id, success: true, message: "Created Successfully." });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/verify-checkout-session', async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error) {
        console.error('Error verifying session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User routes
app.get('/getUser', (req, res) => {
    UserModel.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err))
});

app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
        .then(user => res.json(user))
        .catch(err => res.json(err))
});

app.post("/createUser", (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
});

app.put('/updateUser/:id', (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    // Filter out empty values
    const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => value !== null && value !== undefined && value !== '')
    );

    UserModel.findByIdAndUpdate({ _id: id }, filteredData, { new: true })
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: 'Internal server error', details: err }));
});


app.delete('/deleteUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({ _id: id })
        .then(user => res.json(user))
        .catch(err => res.json(err))
});

app.put('/updateUserHour/:username', (req, res) => {
    const username = req.params.username;
    const { hour } = req.body;

    UserModel.findOneAndUpdate({ name: username }, { hour }, { new: true })
        .then(user => {
            if (user) {
                res.json({ success: true, message: 'User hour updated successfully', user });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ success: false, message: 'Internal server error', error: err }));
});

// Program routes
app.get('/programs', (req, res) => {
    ProgramModel.find({})
        .then(programs => res.json(programs))
        .catch(err => res.json(err))
});

app.get('/programs/:id', (req, res) => {
    const id = req.params.id;
    ProgramModel.findById({ _id: id })
        .then(program => res.json(program))
        .catch(err => res.json(err))
});

app.post('/programs', (req, res) => {
    ProgramModel.create(req.body)
        .then(program => res.json(program))
        .catch(err => res.json(err))
});

app.put('/programs/:id', (req, res) => {
    const id = req.params.id;
    ProgramModel.findByIdAndUpdate({ _id: id }, req.body, { new: true })
        .then(program => res.json(program))
        .catch(err => res.json(err))
});

app.delete('/programs/:id', (req, res) => {
    const id = req.params.id;
    ProgramModel.findByIdAndDelete({ _id: id })
        .then(program => res.json(program))
        .catch(err => res.json(err))
});

app.listen(process.env.PORT, () => {
    console.log('server is running')
})