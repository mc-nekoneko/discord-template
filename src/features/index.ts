import { App } from '../app'
import * as fs from 'fs'

const features = {
    init: (app: App) => {
        const features = fs.readdirSync(__dirname).filter((file) => !file.endsWith('.js'))

        for (const file of features) {
            const feature = require(`./${file}`).default
            feature(app)
        }
    },
}

export default features
