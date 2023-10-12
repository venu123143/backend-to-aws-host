"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught Exception`);
});
require("dotenv/config");
require("./config/db.js");
const app = (0, express_1.default)();
const UserRoute_js_1 = __importDefault(require("./routes/UserRoute.js"));
const options = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    withCredentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.get('/', (req, res) => {
    res.send('backend home route sucessful');
});
app.use('/api/users', UserRoute_js_1.default);
const swagOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "sample api documentation",
            version: '1.0.0',
            description: "this is the description page for the sagger pages.",
            contact: {
                name: "Coding Expert",
                url: "https://venugopalportfolioweb.onrender.com",
                email: "venugopal.v@ahex.co.in"
            }
        },
        servers: [
            {
                url: "http://localhost:5000/api",
            },
        ]
    },
    apis: ["./src/routes/*.ts"]
};
const swags = (0, swagger_jsdoc_1.default)(swagOptions);
app.use("/api", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swags));
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`server is running on port number ${port}`);
});
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`Shutting down the server for unhandle promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});
