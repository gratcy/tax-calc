'use strict'

const PORT = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? process.env.PORT : 1818
const BASE_DOMAIN = process.env.BASE_DOMAIN || '0.0.0.0'

const CONFIG = {
  ROOT: process.cwd(),
  DATABASE: {
    HOST: process.env.DATABASE_HOST,
    USER: process.env.DATABASE_USER,
    PASSWORD: process.env.DATABASE_PASSWORD,
    DB: process.env.DATABASE_NAME
  },
  SERVER: {
    PORT: PORT,
    BASE_DOMAIN: BASE_DOMAIN,
    BASE_WEBHOST: `http://${BASE_DOMAIN}:${PORT}/`
  }
}

module.exports = CONFIG
