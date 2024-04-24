

import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import winston from 'winston';
import { mode } from './config/config.commander.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const creaHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password);



const niveles = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  };
  
  const loggerDesarrollo = winston.createLogger({
    levels: niveles,
    transports: [
      new winston.transports.Console({ 

        level: "debug",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
        )

        })
    ],
    
  });
  
  const loggerProduccion = winston.createLogger({
    levels: niveles,
    transports: [

      new winston.transports.Console({
            
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
        )
     }),

      new winston.transports.File({

        level:"error",
        filename:"./src/logs/errorLogs.log",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ) })
    ],
    
  });
  
  export const middLogg = (req, res, next) => {
    if (mode === 'prod') {
      req.logger = loggerProduccion;
    } else {
      req.logger = loggerDesarrollo;
    }
    next();
  };
