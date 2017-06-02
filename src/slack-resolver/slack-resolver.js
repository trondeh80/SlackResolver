import ResolverCommands from './resolver-commands' ;
import GhostCommands from './ghost-commands' ;
import RemoteCommands from './remote-commands' ;

const Botkit = require('botkit');

export default class SlackResolver {

    constructor(options) {
        this.options = options;
        this.controller = Botkit.slackbot({
            debug: options.debug || false
        });
    }

    startBotKit(){
        return new Promise((resolve, reject) => {
            this.controller.spawn({
                token: this.options.token,
                retry: this.options.retry || 10
            }).startRTM((error) => {
                if (error) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Boots the server, initiates the commands and adds them to the listener
     */
    start() {
        this.startBotKit().then(() => {
            this.resolverCommands = new ResolverCommands(this); // For the resolver/poll functionality
            this.ghostCommands = new GhostCommands(this); // Text 2 links
            this.remoteCommands = new RemoteCommands(this); // Controlling the slack-bot
            this.addListeners();
        }).catch(() => {
           setTimeout(this.start, 5000);
        });
    }

    /**
     * Adds commands to the BotKit controller's hear method.
     */
    addListeners() {
        const listeningMethods = 'direct_message,direct_mention,mention';
        [
            ...this.resolverCommands.getCommands(),
            ...this.remoteCommands.getCommands(),
            ...this.ghostCommands.getCommands()
        ].forEach((cmd) => {
            this.controller.hears(cmd.commands, cmd.listeningMethods || listeningMethods,
                this.getRunnableCommand(cmd.response ? () => this.sendReply(cmd.response) : cmd.method));
        });
    }

    /**
     * Curried function. Every command must run the returned function before they execute.
     *
     * @param replyFunction
     * @returns {function(message)}
     */
    getRunnableCommand(replyFunction) {
        return (bot, message) => {
            this.bot = bot;
            this.message = message;
            this.activeUserId = message.user;
            replyFunction(message);
        }
    }

    /**
     * Main message reply command. All messages are piped through this
     * @param output
     */
    sendReply(output) {
        this.bot.reply(this.message, output) ;
    }

}