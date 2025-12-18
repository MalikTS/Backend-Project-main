const User = require('../models/User.js');
const transporter = require('../mail.js')
const Role = require('../models/Role.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require("../config.js")

require('dotenv').config()

const generateAccessToken = (id, roles) => {
    const payload = { id, roles };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
    async registration(req, res) {
        try {
            console.log(req.body);
            
            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    message: "Ошибка при регистрации", 
                    errors: errors.array() 
                });
            }

            const { username, password, email } = req.body;
            const candidate = await User.findOne({ username });

            if (candidate) {
                return res.status(400).json({ 
                    message: "Пользователь с таким именем уже существует" 
                });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({
                username,
                password: hashPassword,
                email: email,
                roles: [userRole.value]
            });

            if (req.file) {
                user.avatar = req.file.path
            }

            await user.save();

            try {
                await transporter.sendMail({
                    from: "asdsad",
                    to: email,
                    subject: "sssss",
                    html:  `<h1>Добро пожаловать!</h1>
                    <p>Вы успешно зарегистрировались в нашем сервесе.</p>`,
                });
            } catch (mailError) {
             console.log("Ошибка при отправке email:", mailError);
            }

            return res.json({ message: "Пользователь был успешно зарегистрирован" });
        } catch (e) {
       
            return res.status(500).json({ message: "Registration error", error: e.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({ 
                    message: `Пользователь ${username} не найден` 
                });
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ 
                    message: "Введен неверный пароль" 
                });
            }

            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token });
        } catch (e) {
            console.log("Ошибка при входе", e);
            return res.status(500).json({ message: "Login error" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (e) {
            console.error("Ошибка получения пользователей", e);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new authController();