import { Command } from '../../structures'
import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export default new (class extends Command {
    builder(): SlashCommandBuilder {
        return new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        interaction.reply('Pong!')
    }
})()
