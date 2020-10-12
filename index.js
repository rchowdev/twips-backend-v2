import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World"));

app.listen(port, () => console.log(`Server Running on PORT: ${port}`));
