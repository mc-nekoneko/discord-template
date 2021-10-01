import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export abstract class Command {
    private cache?: SlashCommandBuilder

    public _builder(): SlashCommandBuilder {
        if (!this.cache) {
            this.cache = this.builder()
        }

        return this.cache
    }

    public abstract builder(): SlashCommandBuilder

    public abstract execute(interaction: CommandInteraction): Promise<void>
}
