import winston, {format} from "winston";

const {combine, prettyPrint, timestamp} = winston.format;
const LEVEL = Symbol.for('level')

function filterOnly(level) {
    return format( (info) => {
        if (info[LEVEL] === level) {
            return info;
        }
    })();
}

const logger = winston.createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
        new winston.transports.Console({ level: 'info'}),
        new winston.transports.File({ filename: './logs/warn.log', format: filterOnly('warn'), level: 'warn'}),
        new winston.transports.File({ filename: './logs/error.log', format: filterOnly('error'), level: 'error'})
    ]
})

function loggerErrorController(msg) {
    logger.error('Ha ocurrido un error: '+ msg)
}

function loggerReqController(req, level) {
    if(level === 'warn'){
        logger.warn(`Ruta: ${req.url}, método: ${req.method} no implementada`);
    } else {
        logger.info(`Ruta: ${req.url}, método: ${req.method}`);
    }
}

function loggerController(msg) {
    logger.info(msg)
}

export {loggerReqController, loggerErrorController, loggerController}