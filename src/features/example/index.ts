import { App } from '../../app'
import * as command from './Command'
import * as event from './Event'

export function init(app: App): void {
    app.getCommandManager().registerCommand(command.default)
    app.getClient().on('messageCreate', event.messageCreate)
}
