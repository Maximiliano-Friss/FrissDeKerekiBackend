import dotenv from 'dotenv';
import express from 'express'
import handlebars from 'express-handlebars'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from "http";
import { Server } from "socket.io";
import routerEcommerce from './routes/routerEcommerce.js';
import routerProducts from './routes/routerProducts.js';
import cluster from 'cluster';
import os from 'os'
import path from 'path';
import flash from 'connect-flash';
import { loggerErrorController, loggerReqController, loggerController } from './controllers/loggerControllers.js';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const routerProd = new routerProducts()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.use('/api/ecommerce', routerEcommerce(io));
app.use('/api/productos', routerProd.start());
app.set('socketio', io);
app.get('*', (req,res) => {
    loggerReqController(req, 'warn')
    res.sendFile(path.join(__dirname, 'public', 'images', '404Error.png')) // Imagen tomada de https://storyset.com
})

// HANDLEBARS
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}))
app.set('view engine', 'hbs')
app.set('views', './views')

const MODE = process.env.MODE || "FORK"
const PORT = process.env.PORT || 8080

// SERVER
if(MODE == 'CLUSTER') {
    if (cluster.isPrimary) {
        const numCPUs = os.cpus().length
        loggerController(`PID number (CLUSTER PRIMARY): ${process.pid}`)
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', worker => {
            loggerController(`Worker ${worker.process.pid} died: ${new Date().toString()}`)
            cluster.fork()
        })

    } else {
        httpServer.listen((PORT), () => {
            loggerController(`Escuchando en el PORT ${PORT}. PID (WORKER): ${process.pid}`)
        })
        httpServer.on('error', error => loggerErrorController(error))
    }
} else if(MODE == 'FORK') {
    httpServer.listen((PORT), () => {
        loggerController(`Escuchando en el PORT ${PORT} en modo FORK. PID: ${process.pid}`)
    })
    httpServer.on('error', error => loggerErrorController(error))
}
