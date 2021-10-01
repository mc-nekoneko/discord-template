import * as dotenv from 'dotenv'
import { App } from './app'
import * as features from './features'

// Load .env file
dotenv.config()

const app = new App(process.env.DISCORD_TOKEN, process.env.CLIENT_ID)

features.init(app)

process.on('SIGINT', () => {
    app.destroy()
})

app.start()
