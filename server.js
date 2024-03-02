const express = require('express');
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// const whiteList = ["http://localhost:3000", "https://meusite.vercel.app"];

// const corsOptions = {
//     origin(origin, callback) {
//         if (whiteList.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
// };

// app.use((request, response, next) => {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Methods", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cors());
const generalRoute = require("./src/routes/generalRoute");
const userRoute = require("./src/routes/userRoute");
const bookRoute = require("./src/routes/bookRoute");

app.use("/", generalRoute);
app.use("/users", userRoute);
app.use("/books", bookRoute);

app.use(express.json());
// app.use(cors(corsOptions));


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});