import { App } from './App'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Interaction } from 'discord.js'
import { Command } from '../structures'
import { SlashCommandBuilder } from '@discordjs/builders'

export class CommandManager {
    private readonly rest: REST

    private readonly commands: Map<string, Command> = new Map<string, Command>()

    public constructor(app: App) {
        this.rest = app.getRest()

        app.getClient().on('ready', () => this.onCommandSync(app))
        app.getClient().on('interactionCreate', (interaction) => this.onCommandHandler(interaction))
    }

    private async onCommandSync(app: App): Promise<void> {
        if (this.commands.size === 0) return

        const clientId = app.getClientId()
        const guildIds = app.getClient().guilds.cache.map((guild) => guild.id)
        const builders = new Map<string, SlashCommandBuilder[]>()

        Array.from(this.commands.values()).forEach((command) => {
            guildIds.forEach((guildId) => {
                const builder = command.createBuilder(app, guildId)
                if (!builders.has(guildId)) builders.set(guildId, [])

                builders.get(guildId)?.push(builder)
            })
        })

        // APIに負荷がかかるのでよろしくない
        // Botが参加しているギルドの数が多ければapplicationCommandsを使うべきだ

        builders.forEach(async (builders, guildId) => {
            const rawData = builders.map((builder) => builder.toJSON())
            await this.rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: rawData,
            })
        })
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
        if (this.commands.has(command.getName())) {
            throw new Error(`Command ${command.getName()} is already registered.`)
        }

        this.commands.set(command.getName(), command)
    }
}
