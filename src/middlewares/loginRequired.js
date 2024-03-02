const jwt = require("jsonwebtoken");

const loginRequired = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.staus(401).json({ error: "Token não fornecido" });
    }

    const [_, tkn] = token.split(" ");

    try {
        const payload = jwt.verify(tkn, process.env.JWT_SECRET);

        req.userId = payload.id;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = loginRequired;
