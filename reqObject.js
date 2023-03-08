const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {

    // console.log(req.method)
    // console.log(req.params.name); '/:name'
    // console.log(req.query); '/?name=node'

    res.status(200).json({
        message: 'All about request object.'
    });
});

app.post('/', (req, res) => {
    console.log(req.body);
})

app.listen(3000, () => {
    console.log('Server has started.')
});