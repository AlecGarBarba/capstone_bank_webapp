const express = require('express');
const { response } = require('express');
const path = require('path');
const router = express.Router();



router.use(express.static(path.join(__dirname, 'views')));


//paths: 
router.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname +'/views'}  );
});

router.get('/submit', (req, res) => {
    res.sendFile('submit.html', {root: __dirname +'/views'}  );
});




router.get('*', (req,res)=> {
    res.end('<h1>No se encuentra naaa </h1>')
});



module.exports = router;