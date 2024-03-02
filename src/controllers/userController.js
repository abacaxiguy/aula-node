const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const addUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const hash = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
            },
        });

        res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
        console.log(error);
    }
};

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

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
};

const deleteUser = async (req, res) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

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
};

module.exports = { addUser, updateUser, deleteUser };
