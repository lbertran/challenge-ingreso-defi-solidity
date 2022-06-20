// subir a heroku
//https://www.youtube.com/watch?v=dw1y7qwNb4E

// https://www.youtube.com/watch?v=zsnHIlsUPSU
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import axios from 'axios';

const PORT = process.env.PORT || 3050;
const app = express();
app.use(bodyParser.json());
dotenv.config();

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

// Route
app.get('/',(req, res) => {
    res.send('Challenge Ingreso Career Switch: DeFI-Solidity Edition - author: bertranluciano@gmail.com - repositorio: https://github.com/lbertran/challenge-ingreso-defi-solidity')
});

app.get('/check',(req, res) => {

    const email = req.query.email;

    check(email).then(data => console.log(data));
    
    
    
});

async function check(email){
    let tokenObject = await getToken(email)
    
    let blocksObject = await getBlocks(tokenObject.token)

    let stringfinal = await ordenamiento(tokenObject.token, blocksObject.data)

    return stringfinal
    
}

async function getToken(email) {
    try {
       let res = await axios({
            url: process.env.RCSAPI+'token?email='+email,
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(res.status == 200){
            // test for status you want, etc
            console.log(res.status)
        }    
        // Don't forget to return something   
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}

async function getBlocks(token) {
    try {
       let res = await axios({
            url: process.env.RCSAPI+'blocks?token='+token,
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(res.status == 200){
            // test for status you want, etc
            console.log(res.status)
        }    
        // Don't forget to return something   
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}

async function ordenamiento(token, blocks) {
    try {
        const cantidadbloques = blocks.length
        const arrayordenado = []
        arrayordenado[0] = blocks[0]
        blocks.splice(0, 1);

        var pocisionbuscada = 1;

        while(pocisionbuscada <= cantidadbloques){
            var chequeo = false;

            blocks.forEach(element => {
                if(!chequeo){
                    let res = axios({
                        url: process.env.RCSAPI+'check?token='+token,
                        method: 'post',
                        timeout: 8000,
                        headers: {},
                        data: {
                            blocks: [arrayordenado[pocisionbuscada-1],element]
                        }
                    });
                    if(res.status == 200){
                        // test for status you want, etc
                        chequeo = res.data.message
                        if(chequeo){
                            arrayordenado[pocisionbuscada] = blocks[indicecorrecto]
                            blocks.splice(indicecorrecto, 1);
                            pocisionbuscada = blocks.length + 1 
                        };
                    }; 
                }
                
                
            });

            //

            
        }
        // Don't forget to return something   
        return blocks
    }
    catch (err) {
        console.error(err);
    }
}
