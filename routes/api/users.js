// EXPRESS AND ROUTER
const express = require("express");
const router = express.Router();

// DEPENDENCIES
const axios = require('axios');
const sgMail = require('@sendgrid/mail')
const airtable = require('airtable');

// KEYS AND IDS
const getWaitlistApi = process.env.GET_WAITLIST_API_KEY || "L6CUFR" 
const sendgridApi = process.env.SENDGRID_API_KEY || "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"
const sendgridId = process.env.SENDGRID_TEMPLATE_ID || "d-d9790e6a872b42aca7bb738f16ecae6b"
const airtableApi = process.env.AIRTABLE_API_KEY || "keyFJLBT7qHUa6flc"

// CONFIGURE DEPENDENCIES
airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: airtableApi
});
const base = airtable.base('appTRDdyfkb3mmSYF');

// User Model
const User = require("../../models/User");

// @route   GET api/users
// @desc    Get all users in the waitlist
// @access  Public
router.get('/', (req, res) => {
    User.find()
        .sort({ date: -1 })
        .then(users => res.json(users))
});

// @route   POST api/users/status
// @desc    Get user's waitlist information
// @access  Public
router.post('/status', (req, res) => {
    axios.post("https://getwaitlist.com/api/v1/users/status", {
        api_key: getWaitlistApi,
        email: req.body.email
    }).then(
        info => res.json(info.data)
    ).catch(
        err => console.log(err)
    )
});

// @route   POST api/users
// @desc    Create a user in the waitlist
// @access  Public
router.post('/', (req, res) => {
    // Insert POST request to GetWaitlist and save user
    axios.post("https://getwaitlist.com/api/v1/waitlists/submit", {
        api_key: getWaitlistApi,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        // content_creator_url: req.body.url,
        referral_link: req.body.referral_link
    }).then(
        info => res.json(info.data)
    ).catch(
        err => console.log(err)
    )
    
    // Send Dynamic Template Email from Sendgrid
    sgMail.setApiKey(sendgridApi)
    const msg = {
        from: 'murch.info@gmail.com',
        template_id: sendgridId,
        personalizations: [{
            to: { email: req.body.email },
            dynamic_template_data: {
                first_name: req.body.first_name
            }
        }]
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((err) => {
            console.error(err)
        })

    // Save to Airtable
    base('Waitlist').create([
        {
            "fields": {
                "last_name": req.body.last_name,
                "first_name": req.body.first_name,
                "email": req.body.email,
                "content_creator_url": req.body.url
            }
        }
    ], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function(record) {
            console.log(record.getId());
        });
    });

    // Save to MongoDB Database
    const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        url: req.body.url
    })

    newUser
        .save()
        .then(user => console.log(user))
        .catch(err => console.log(err))
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Public
router.delete('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => user.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }))
})

module.exports = router;