import fs from "fs";
const path = 'database.json';

class ProductManager{

    constructor(path){
        this.products = [];
        this.id = 0;
        this.path = path;
    }

    loadDatabase = async () => {
        if(fs.existsSync(this.path)){
            const db = await fs.promises.readFile(this.path, 'utf8');
            this.products = JSON.parse(db);
        } else {
            this.products = [];
        }
        this.id = this.products[this.products.length-1] ? (this.products[this.products.length-1].id+1) : 1;
    }

    addProduct = async (title, description, price, url, code, stock) => {

        await this.loadDatabase();

        if (title && description && price && url && code && stock){
            const verificationCode = this.products.some (product => product.code === code);
            if (verificationCode){
                return "codigo Repetido";
            }else{
                
                const newProduct = {id: this.id++, title, description, price, url, code, stock};
                this.products.push(newProduct);
                await this.updateDB(this.products);
            }
        }else {
            return "Complete todos los campos";
        }
    }

    updateProduct = async(id, newObject) => {

        await this.loadDatabase(this.path);

        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return "producto no encontrado"
        }else{
            const updateProduct = {
                ...this.products[productIndex],
                ...newObject
            }

            this.products[productIndex] = updateProduct;    
            await this.updateDB(this.products);
            return
        }    
    }

    deletProduct = async(id) => {

        await this.loadDatabase();
        const index = this.products.findIndex(product => product.id === id);
        
        if (index === -1){
            return "no se encuentra ID";
        }else {
            this.products.splice(index, 1);
            this.id = id;
            await this.updateDB(this.products);
            return
        }
    }

    getProducts = async() => {
        await this.loadDatabase();
        return this.products;
    }

    getProductByID = async(id) => {
        await this.loadDatabase(this.path);
        const productID = this.products.find(product => product.id === id);
        if (!productID){
            return "Not found"
        }else {
            return productID;
        }
    }

    updateDB = async (newProduct) => {
        fs.promises.writeFile(this.path, JSON.stringify(newProduct));
        return;
    }

}

export {ProductManager};


const productManager = new ProductManager(path);

//productManager.addProduct("producto prueba1", "esto es un producto prueba", 200, "sin imagen", "abc120", 25);
//productManager.addProduct("producto prueba2", "esto es un producto prueba", 200, "sin imagen", "abc121", 25);
//productManager.addProduct("producto prueba3", "esto es un producto prueba", 200, "sin imagen", "abc122", 25);
//productManager.addProduct("producto prueba4", "esto es un producto prueba", 200, "sin imagen", "abc123", 25);
//productManager.addProduct("producto prueba5", "esto es un producto prueba", 200, "sin imagen", "abc124", 25);
//productManager.addProduct("producto prueba6", "esto es un producto prueba", 200, "sin imagen", "abc125", 25);
//productManager.addProduct("producto prueba7", "esto es un producto prueba", 200, "sin imagen", "abc126", 25);
//productManager.addProduct("producto prueba8", "esto es un producto prueba", 200, "sin imagen", "abc127", 25);
//productManager.addProduct("producto prueba9", "esto es un producto prueba", 200, "sin imagen", "abc128", 25);
//productManager.addProduct("producto prueba10", "esto es un producto prueba", 200, "sin imagen", "abc129", 25);

//productManager.updateProduct(1, { title: "Papas", description: "Papas fritas", price: 70, url: "google.com/fideos", code: 135, stock: 24 });
//productManager.getProducts();
//productManager.getProductByID(1);
//productManager.deletProduct(1);