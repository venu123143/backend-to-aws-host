import express, { Application } from "express"
import cors from "cors"
import morgan from "morgan"

// swagger
import swaggerjsdoc from "swagger-jsdoc"
import swaggerui from "swagger-ui-express"

// Handle uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught Exception`);
})

// config env and database connection.
import 'dotenv/config'
import "./config/db.js"

const app: Application = express();

// imports
import User from "./routes/UserRoute.js"


// cors, json and cookie-parser
export interface Options {
    origin: string[],
    credentials: boolean,
    withCredentials: boolean,
    optionSuccessStatus: number
}
const options: Options = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    withCredentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(options));
app.use(express.json());
app.use(morgan('dev'))

// controllers
app.get('/', (req, res) => {
    res.send('backend home route sucessful')
})

app.use('/api/users', User)


// Swagger , Error handler and server port
const swagOptions = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"sample api documentation",
            version:'1.0.0',
            description:"this is the description page for the sagger pages.",
            contact:{
                name:"Coding Expert",
                url:"https://venugopalportfolioweb.onrender.com",
                email:"venugopal.v@ahex.co.in"
            }
        },
        servers:[
            {
                url:"http://localhost:5000/api",
            },
        ]
    },
    apis:["./src/routes/*.ts"]
}
const swags = swaggerjsdoc(swagOptions)
app.use("/api",swaggerui.serve,swaggerui.setup(swags))

const port = process.env.PORT || 5000
const server = app.listen(port, () => {
    console.log(`server is running on port number ${port}`);
})

// unhandled promise rejection
process.on("unhandledRejection", (err: Error) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`Shutting down the server for unhandle promise rejection`);
    server.close(() => {
        process.exit(1)
    })

})
