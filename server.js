const express = require('express');
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());


const loginRequired = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.json({ error: "Token não fornecido" }, 401);
    }

    const [_, tkn] = token.split(" ");

    try {
        const payload = jwt.verify(tkn, "SECRETO");

        req.userId = payload.id;

        next();
    } catch (error) {
        return res.json({ error: "Token inválido" }, 401);
    }
};

app.post("/users", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ error: "Preencha todos os campos" }, 400);
    }

    const hash = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
            },
        });
        
        res.json({ message: "Usuário criado com sucesso" }, 201);
    }
    catch (error) {
        res.json({ error: "Erro ao criar usuário" }, 500);
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return res.json({ error: "Usuário não encontrado" }, 404);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.json({ error: "Senha incorreta" }, 401);
    }

    const token = jwt.sign({ id: user.id }, "SECRETO", {
        expiresIn: "1d",
    });

    res.json({ "jwt": token });
});

// aula purposes
app.get("/users", loginRequired, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
        console.log(error);
    }
});

app.put("/users", loginRequired, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Update user information
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                email,
                password: await bcrypt.hash(password, 10),
            },
        });

        res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
        console.log(error);
    }
});

app.delete("/users", loginRequired, async (req, res) => {
    try {
        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Delete user
        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
        console.log(error);
    }
});

app.post("/books", loginRequired, async (req, res) => {
    const { title } = req.body;

    try {
        const newBook = await prisma.book.create({
            data: {
                title,
                user: {
                    connect: {
                        id: req.userId,
                    },
                },
            },
        });

        res.status(201).json({ message: "Livro criado com sucesso", book: newBook });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar livro" });
        console.log(error);
    }
});

app.get("/books", loginRequired, async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            where: {
                userId: req.userId,
            },
        });

        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar livros" });
        console.log(error);
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'AAAAÉÉÉÉÉÉ!' });
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});