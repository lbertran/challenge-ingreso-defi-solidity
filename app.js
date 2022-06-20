// subir a heroku
//https://www.youtube.com/watch?v=dw1y7qwNb4E

// https://www.youtube.com/watch?v=zsnHIlsUPSU
import express from "express";
import dateFormat, { masks } from "dateformat";
import bodyParser from "body-parser";
import StellarSdk from 'stellar-sdk';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3050;
const app = express();
app.use(bodyParser.json());

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

// Route
app.get('/',(req, res) => {
    res.send('Welcome to BlockchainCore API by TOB GROUP SOLUTIONS')
});

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
dotenv.config();

const sourceKeys = StellarSdk.Keypair.fromSecret(process.env.SECRET);
const destination = "GCL2MRTHUH44RBWPTL6UDHT754UX2QRRGGFXSYFZJLFHRVFQ6UFDNRL4";



// STELLAR

app.post('/stampHashStellar',(req, res) => {
    
    const memo = new StellarSdk.Memo(
        "hash",
        req.body.hash
    );

    const sendTransaction = async () => {
        try {
            // Revisamos que la cuenta exista para evitar errores
            // y cobros innecesarios de comisiones
            await server.loadAccount(destination);
            const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

            // Armamos la transacción
            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
            })
            .addOperation(
                StellarSdk.Operation.payment({
                destination: destination,
                // Dado que Stellar permite transacciones en diferentes
                // tipos de cambio, debes especificar la moneda en la que enviarás
                // El tipo "native" se refiere a Lumens (XLM)
                asset: StellarSdk.Asset.native(),
                // https://developers.stellar.org/docs/issuing-assets/anatomy-of-an-asset/
                //The smallest non-zero amount unit is 0.0000001 (one ten-millionth) represented as an integer value of one.
                amount: "0.0000001"
                })
            )
            .addMemo(
                memo
            )
            // Espera un máximo de tres minutos por la transacción
            .setTimeout(180)
            .build();

            // Firmamos la transacción para autenticar nuestra identidad
            transaction.sign(sourceKeys);
            // Finalmente la enviamos a Stellar
            const result = await server.submitTransaction(transaction);
            console.log("Success! Results:", result);
            
            res.json(result);
        } catch (err) {
            console.error("An error has occurred", err);
            res.send("An error has occurred", err);
        }
    };
    sendTransaction();
});

app.post('/validateHashStellar',(req, res) => {
    server
    .transactions()
    .transaction(
        req.body.transaction,
    )
    .call()
    .then(function (resp) {
        console.log(resp);
        res.json(resp);
    })
    .catch(function (err) {
        console.error(err);
        res.send("An error has occurred", err);
    });
});
