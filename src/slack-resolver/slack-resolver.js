const Botkit = require('botkit') ;
import Resolver from './resolver' ;

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
        this.resolver = new Resolver(this);
        this.addListeners();
    }

    addListeners() {

        const listeningMethods = 'direct_message,direct_mention,mention';

        // Resolving commands:
        this.controller.hears(['Resolve:'], listeningMethods, this.runCommand(this.resolver.createIssue.bind(this.resolver)));
        this.controller.hears(['Conclude!', 'Conclude:'], listeningMethods, this.runCommand(this.resolver.concludeIssue.bind(this.resolver)));
        this.controller.hears(['ClearIssues'], listeningMethods, this.runCommand(this.resolver.clearIssue.bind(this.resolver)));
        this.controller.hears(['AddAlternative:'], listeningMethods, this.runCommand(this.resolver.addAlternative.bind(this.resolver)));
        this.controller.hears(['Vote:'], listeningMethods, this.runCommand(this.resolver.voteAlternative.bind(this.resolver)));
        this.controller.hears(['ListAlternatives'], listeningMethods, this.runCommand(this.resolver.listAlternatives.bind(this.resolver)));

        // help
        this.controller.hears(['HelpResolve'], listeningMethods, this.runCommand(this.resolver.showHelp.bind(this.resolver)));

        // Random
        this.controller.hears(['RTFM'], listeningMethods, this.runCommand(this.readManual.bind(this)));

    }

    runCommand(replyFunction) {
        return (bot, message) => {
            this.bot = bot;
            this.message = message;
            this.activeUserId = message.user;
            replyFunction(message);
        }
    }


    readManual() {
        this.sendReply('https://nerddrivel.files.wordpress.com/2013/05/moses-rtfm.jpg');
    }

    sendReply(output) {
        this.bot.reply(this.message, output)
    }

}