import { App } from '../../app'
import { Message, CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export default (app: App): void => {
    app.getCommandManager().registerCommand({
        builder: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),

        execute: async (interaction: CommandInteraction): Promise<void> => {
            interaction.reply('Pong!')
        },
    })

    app.getClient().on('messageCreate', (message: Message) => {
        if (message.content === 'ping') {
            message.reply('Pong!')
        }
    })
}
