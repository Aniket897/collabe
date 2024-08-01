import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
