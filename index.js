const path = require('path');
const express = require('express');
require ('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routers/authRouter.js');
const productRouter = require('./routers/productRouter.js')

const PORT = process.env.PORT || 3000

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api", productRouter);

app.get('/api', (req, res) => {

    res.status(200).json("Сервер работает")

})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


const start = async () => {

    try {
        await mongoose.connect(process.env.DATABASE_URL);
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
    } catch (e) {
        console.log("Ошибка при запуске сервера", e)
    }

} 



start()
