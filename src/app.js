import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
const productManager = new ProductManager('database.json');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const prod = await productManager.getProducts();
        const limitProd = limit >= 0 ? limit : prod.length;
        res.send(prod.slice(0, limitProd));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const prodID = parseInt(req.params.pid)
        const prod = await productManager.getProductByID(prodID);
        res.send(prod);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
})

app.listen(8080, () => {
    console.log('Servidor iniciado')
})