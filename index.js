//Loading libraries
///express
const express = require('express');
const path = require('path');
const http = require('http');
const colors = require('colors');
const https = require('https');
const routes = require('./paths');
const bodyParser = require('body-parser');
const app = express();



///node js tensorflow :)
const tf = require("@tensorflow/tfjs");
const tfn = require('@tensorflow/tfjs-node-gpu');
const { resolve } = require('path');



//settings
//app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(routes);
//usage

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));


async function predictNN_v2(arr){
    const handler = tfn.io.fileSystem("./views/tfjsmodel/model.json");
    const model =  await tf.loadLayersModel(handler);
    
    var pred = model.predict(tf.tensor2d(   arr, [1,13]        )).dataSync()[0];
        
    console.log("Your credit probabilityscore : ", pred);

      return pred;  
}


function scale( x, max, min){
    var std = (x - min) / (max - min);
    
    return (std*(1)+0)
}


function scale_arr(X, Max, Min){
    arr_scaled = []
    for (var i = 0; i < X.length; i++){
        arr_scaled.push(scale(X[i], Max[i], Min[i]));

    }
    console.log("the arr_scaled is");
    console.log(arr_scaled);
    return arr_scaled;
}



function data_to_arr(dict){
    //X_scaled= (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))
    //ApplicantIncomemax = 81,000, ApplicantIncomeMin = 150
    //Coapplicant:   41667, 0,
    //Loan Amount =  700, 9
    //Loan_Amount_Term = 480,12
    max = [1,1,1,1,1,1,1,1,81000 , 41667 , 700, 480, 1];

    min = [0,0,0,0,0,0,0,0,150 , 0     , 9  , 12 , 0];

    var a =0, b= 0, c = 0;

    if(dict.zone =='rural'){
        a= 1;
    }else if(dict.zone =='semiurban'){
        b=1;
    }else{ c =1;}
    var arr = [ a, b , c ,  +dict.gender, +dict.married, +dict.dependents, +dict.education, +dict.employed, +dict.income, +dict.coincome, +dict.LoanAmount /1000, +dict.term, +dict.credit];

    return scale_arr(arr, max, min);
    
}


app.listen(3000, () =>{
    console.log('servidor escuchando en puerto 3000'.green);
});

app.post('/', function (req, res, next ) {
    const data = req.body;
    arr_to_nn = data_to_arr(data)
    arr = [1    ,0,         0,       1,       1,       0 ,           1,          0,                 5849          ,    0         ,       129        ,   360 ,             1 ]
    
    console.log(arr_to_nn);

    var pred2= predictNN_v2(arr_to_nn).then((valor) =>{
        if(valor > 0.49){
            res.end("<h1>Your credit has been preapproved,we will contact you to verify your information and complete the process.  Neural network probability: "+valor+"</h1>");
            next();
        }else{
            res.end("<h1>We're sorry  to inform you that your loan can't be approved. </h1>");
            next();
        }
        
    }, () =>{
        res.end("<h2>We're sorry to inform you, your application could not be processed</h2>");
        next();
    });

  });