const Product = require('../models/Product.js');



class ProductController {

    async addProduct(req, res) {
        try {
            const { title, description, price } = req.body
            const product = await Product.create({ title, description, price })

            if (req.files) {
                let path = " "
                req.files.forEach(element =>{
                    path += element.path + ","
                });
                path = path.substring(0, path.lastIndexOf(","))
                product.img = path;

            }

            res.json("Продукт успешно добавлен", product);

        } catch (error) {
            console.log("Ошибка при добавлении товара", error);

            res.status(400).json({ error: error.message })
        }
    }

    async getProducts(req, res) {
        try {
            const products = await Product.find()
            
            return res.json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    async getOneProduct(req, res) {
        try {
            const { id } = req.params
            const product = await Product.findById(id);

            return res.json(product);
        } catch (error) {
            console.log("Ошибка при получении товара \n", error)
            return res.status(500).json({ error: error.message })
        }
    }

    async updateProduct(req, res) {
        try {
            const product = req.body

            if(!product._id) {
                res.status(400).json({ message: "ID не указан" });
            }
            const updateProduct = await Product.findByIdAndUpdate(product._id, product, { new: true });

            console.log("Товар успешно обновлен");
            return res.json(updateProduct);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    async editProduct(req, res) {
        try {
            const { id } = req.params
            const { title, description, price } = req.body
            const product = await Product.findByIdAndUpdate(
                {
                    _id: id,
                    title: title,
                    description: description,
                    price: price
                },
                
                { 
                    new: true,
                }
            );      

            if (!product) {
                res.status(404).json({ message: "Товар не найден" })
            }

            res.status(200).json({ message: "Товар изменен" })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params
            const product = await Product.findByIdAndDelete(id);

            return res.json({ message: 'Товар успешно удален' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message })
        }
    }

}



module.exports = new ProductController();
