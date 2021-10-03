import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { App } from '../app'

export abstract class Command {
    protected readonly name: string

    constructor(name: string) {
        this.name = name
    }

    public getName(): string {
        return this.name
    }

    public abstract createBuilder(app: App, guildId: string): SlashCommandBuilder

    public abstract execute(event: CommandInteraction): Promise<void>
}
