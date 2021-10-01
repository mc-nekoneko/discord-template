import { App } from '../app'
import * as fs from 'fs'

export function load(app: App) {
    const features = fs.readdirSync(__dirname).filter((file) => !file.endsWith('.js'))

    for (const file of features) {
        const feature = require(`./${file}`).default
        feature(app)
    }
}
