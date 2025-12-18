const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = function () {

    return function (req, res, next) {

        if (req.method === "OPTIONS") {
                next()
            }

        try {
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизирован" });
            }

            const { roles: userRoles } = jwt.verify(token, secret);
            let hasRole = false
            userRoles.forEach(role => {
                if (role.includes(role)) {
                    hasRole = true
                }
            })

            if (!hasRole) {
                return res.status(403).json({ message: "У вас нет доступа" });
            }

            next()
        } catch (e) {
            console.log("Ошибка верификации токена", e);
            return res.status(403).json({ message: "Пользователь не авторизирован" });
        }

    }

}