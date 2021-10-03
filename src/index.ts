import * as dotenv from 'dotenv'
import { App } from './app'
import features from './features'

const main = async () => {
    const app = new App(process.env.DISCORD_TOKEN, process.env.CLIENT_ID)

    features.init(app)

    process.on('SIGINT', async () => await app.destroy())

    await app.start()
}

// Load .env file
dotenv.config()

main()
