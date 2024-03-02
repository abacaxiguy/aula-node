const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addBook = async (req, res) => {
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
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar livro" });
        console.log(error);
    }
};

const getBooks = async (req, res) => {
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
};

module.exports = { addBook, getBooks };
