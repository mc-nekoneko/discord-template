import { App } from '../../app'
import { Message, CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../structures'

class PingCommand extends Command {
    constructor() {
        super('ping')
    }

    public createBuilder() {
        return new SlashCommandBuilder().setName(this.name).setDescription('Replies with Pong!')
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        interaction.reply('Pong!')
    }
}

const messageCreate = (message: Message) => {
    if (message.content === 'ping') {
        message.reply('Pong!')
    }
}

export default (app: App): void => {
    app.getCommandManager().registerCommand(new PingCommand())

    app.getClient().on('messageCreate', messageCreate)
}
