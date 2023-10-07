import { config } from "dotenv"

config()

export const auth0Vars = {
    issuer: process.env.AUTH0_ISSUER_BASE_URL,
    apiAudience: process.env.AUTH0_API_AUDIENCE,
    signingAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
    domain: process.env.AUTH0_DOMAIN,
    m2mClientId: process.env.AUTH0_M2M_CLIENT_ID,
    m2mClientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
    mgmtAudience: process.env.AUTH0_MGMT_API_AUDIENCE,
}

export const dbVars = {
    dbName: process.env.DATABASE_NAME,
    dbUser: process.env.DATABASE_USER,
    dbPass: process.env.DATABASE_PASSWORD,
    dbHost: process.env.DATABASE_HOST,
    dbDialect: process.env.DATABASE_DIALECT
}