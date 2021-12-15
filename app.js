const express = require("express");
const cors = require("cors");
const path = require("path");
const rfs = require("rotating-file-stream");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const { queryParser } = require("express-query-parser");

require("module-alias/register");
const authRoute = require("@routes/auth.route");
const newsRoute = require("@routes/news.route");
const imageRoute = require("@routes/image.route");
const productRoute = require("@routes/product.route");
const cartRoute = require("@routes/cart.route");
const invoiceRoute = require("@routes/invoice.route");
const { handleGlobalError } = require("@middlewares/error.middleware");
const AppError = require("@utils/appError");
const { UNDEFINED_ROUTE } = require("@constants/error");
const admin = require("@admin/app");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(
    queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true
    })
);

const accessLogStream = rfs.createStream("access.log", {
    interval: "30d",
    path: path.join(__dirname, "loggers")
});
morgan.token("body", req => JSON.stringify(req.body));
app.use(morgan("dev", { stream: accessLogStream }));

app.use("/admin", admin);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/image", imageRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/invoice", invoiceRoute);

app.use("*", (req, res, next) => {
    const err = new AppError(404, "fail", UNDEFINED_ROUTE);
    next(err, req, res, next);
});
app.use(handleGlobalError);

module.exports = app;
