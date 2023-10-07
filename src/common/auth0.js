import { ManagementClient } from "auth0"
import { auth0Vars } from "../config/configuration.js"

/**
 * @tutorial https://auth0.github.io/node-auth0/index.html
 */
const auth0Management = new ManagementClient({
    domain: auth0Vars.domain,
    clientId: auth0Vars.m2mClientId,
    clientSecret: auth0Vars.m2mClientSecret,
    audience: auth0Vars.mgmtAudience
})

export default auth0Management