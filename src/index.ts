import app from './app'
import { appConfig } from './core/Configuration'

function main (): void {
  try {
    app.listen(appConfig.develPort)
  } catch (error) {
    console.error(error) // development purposes
  }
}

main()
