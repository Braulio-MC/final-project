import { ManagementClient } from 'auth0'
import { auth0Config } from './Configuration'

const auth0Management = new ManagementClient({
  domain: auth0Config.domain as string,
  clientId: auth0Config.m2mClientId,
  clientSecret: auth0Config.m2mClientSecret,
  audience: auth0Config.mgmtAudience
})

export default auth0Management
