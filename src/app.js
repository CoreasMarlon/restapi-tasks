import express from "express";
import morgan from "morgan";
import cors from "cors";
import TasksRoutes from "./routes/tasks.routes";

const app = express();

//Middlewares
const corsOptions = {};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Settings
app.set("port", process.env.PORT || 3000);

//Routes
app.use("/api/tasks", TasksRoutes);

export default app;
