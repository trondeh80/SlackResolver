const Botkit = require('botkit');

import ResolverCommands from './resolver-commands' ;
import GhostCommands from './ghost-commands' ;

export default class SlackResolver {

    constructor(options) {
        this.options = options;
        this.controller = Botkit.slackbot({
            debug: options.debug || false
        });
    }

    start() {
        this.controller.spawn({
            token: this.options.token
        }).startRTM();
        this.resolverCommands = new ResolverCommands(this);
        this.ghostCommands = new GhostCommands(this);
        this.addListeners();
    }

    addListeners() {
        const listeningMethods = 'direct_message,direct_mention,mention';

        // Register resolver commands
        this.resolverCommands.getCommands().forEach((cmd) => {
            this.controller.hears(cmd.commands, listeningMethods, this.getRunnableCommand(cmd.method));
        });

        // Register secret random commands
        this.ghostCommands.getCommands().forEach((cmd) => {
            this.controller.hears(cmd.commands, listeningMethods, this.getRunnableCommand(() => {
                this.sendReply(cmd.response);
            }));
        });
    }

    getRunnableCommand(replyFunction) {
        return (bot, message) => {
            this.bot = bot;
            this.message = message;
            this.activeUserId = message.user;
            replyFunction(message);
        }
    }

    sendReply(output) {
        this.bot.reply(this.message, output)
    }

}