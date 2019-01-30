const Clarifai = require('clarifai'),
    clarifai = new Clarifai.App({ apiKey: process.env.CLARIFAI_API_KEY })

const clarifaiHandler = ({ body: { input } }, res) => {
    clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, input)
        .then(data => res.json(data)).catch(err => res.status(400).json('Unable to retrieve face recognition data'));
}

const imageHandler = ({ body: { id, entries } }, res, knex) => {
    if(entries === 0) return res.json(0);
    knex('users').where('id', '=', id).increment('entries', entries)
        .returning('entries').then(([ entries ]) => res.json(entries))
        .catch(err => res.status(400).json('Error updating entry count'))
}

module.exports = {
    clarifaiHandler,
    imageHandler
}