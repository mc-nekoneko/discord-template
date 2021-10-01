import { App } from './App'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Interaction } from 'discord.js'
import { Command } from '../structures'

export class CommandManager {
    private readonly rest: REST

    private readonly commands: Map<string, Command> = new Map<string, Command>()

    public constructor(app: App) {
        this.rest = app.getRest()

        app.getClient().on('ready', async () => this.syncCommands(app))
        app.getClient().on('interactionCreate', async (interaction: Interaction) => {
            return this.onCommandHandler(interaction)
        })
    }

    private async syncCommands(app: App): Promise<void> {
        if (this.commands.size === 0) return

        const rawData = Array.from(this.commands.values()).map((cmd) => cmd.builder.toJSON())

        const clientId = app.getClientId()
        const guildIds = app.getClient().guilds.cache.map((guild) => guild.id)

        // APIに負荷がかかるのでよろしくない
        // Botが参加しているギルドの数が多ければapplicationCommandsを使うべきだ

        for (const guildId of guildIds) {
            await this.rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: rawData,
            })
        }
    }

    private async onCommandHandler(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return

        const command = this.commands.get(interaction.commandName)
        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            return interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            })
        }
    }

    public registerCommand(command: Command): void {
        if (this.commands.has(command.builder.name)) {
            throw new Error(`Command ${command.builder.name} is already registered.`)
        }
        
        this.commands.set(command.builder.name, command)
    }
}
