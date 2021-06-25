const express = require('express');
const cors = require('cors');//permite conectar o intermabiar datos entre dos servidores(frontend-backend)
const app = express();

//app.use(express.urlencoded())//SIRVE PARA RECONOCER LOS DATOS ENVIADOS POR EL FORMULARIO

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(cors());

app.listen(5000,()=>{
  console.log('Server on port 5000');
 });
//routes

app.use('/py/eval', require('./routes/python'));//REGISTRO PRINCIPAL DE USUARIOS

app.get('/', (req, res) => {
    res.send('ClouDL server up and running.');
});
