import { Client, Intents } from 'discord.js'
import { REST } from '@discordjs/rest'
import { CommandManager } from './Command'

export class App {
    private readonly token: string
    private readonly clientId: string

    private readonly client: Client
    private readonly rest: REST

    private readonly commandManager: CommandManager

    public constructor(token?: string, clientId?: string) {
        if (!token || typeof token !== 'string') throw new Error('TOKEN_INVALID')
        if (!clientId || typeof clientId !== 'string') throw new Error('CLIENT_ID_INVALID')

        this.token = token
        this.clientId = clientId

        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ],
        })
        this.client.on('ready', this.onReady)

        this.rest = new REST({ version: '9' }).setToken(token)

        this.commandManager = new CommandManager(this)
    }

    private async onReady(): Promise<void> {
        console.log('Ready!')
    }

    public async start(): Promise<void> {
        await this.client.login(this.token)
    }

    public async destroy(): Promise<void> {
        console.log('App destroying')
        this.client.destroy()
    }

    public getClientId(): string {
        return this.clientId
    }

    public getClient(): Client {
        return this.client
    }

    public getRest(): REST {
        return this.rest
    }

    public getCommandManager(): CommandManager {
        return this.commandManager
    }
}
