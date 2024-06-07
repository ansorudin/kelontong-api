import express from "express";
import helmet from "helmet";
import cors from "cors";
import httpStatus from "http-status";
import { errorMiddleware } from "./middleware/errorMiddleware";
import authRouter from "./modules/auth/auth.router";
import productCategoryRouter from "./modules/product-category/product-category.router";
import productRouter from "./modules/product/product.router";
import path from "path";
import morgan from "morgan";
import { HttpError } from "./utils/HttpError";

const app = express();
const port = 9000;

app.use(express.json());

// set security HTTP headers
app.use(helmet());

// enable cors
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(morgan("dev"));

app.use("/file", express.static(path.join(__dirname, "../public")));

app.use("/auth", authRouter);
app.use("/product-category", productCategoryRouter);
app.use("/products", productRouter);

app.use(errorMiddleware);
app.use((req, res, next) => {
  next(new HttpError("Not found", httpStatus.NOT_FOUND));
});

app.listen(port, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
);
