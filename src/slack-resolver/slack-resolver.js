const Botkit = require('botkit');
import Issue from '../issue/issue' ;

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
        this.addListener();
    }

    addListener() {
        this.controller.hears(['Resolve:', 'Conclude:'], 'direct_message, direct_mention, mention', this.createIssue.bind(this));
        this.controller.hears(['ClearIssue'], 'direct_message, direct_mention, mention', this.clearIssue.bind(this));
        this.controller.hears(['AddAlternative'], 'direct_message, direct_mention, mention', this.addAlternative.bind(this));
        this.controller.hears(['Vote:'], 'direct_message, direct_mention, mention', this.voteIssue.bind(this));
        this.controller.hears(['List:'], 'direct_message, direct_mention, mention', this.listAlternatives.bind(this));
    }

    createIssue(bot, message) {
        if (this.issue && !this.issue.resolved) {
            return bot.reply(message, `Current issue is not resolved: ${this.issue.title}. (To clear, type "ClearIssue")`);
        }
        const issueTitle = message.text.replace(/Resolve\:/, '');
        this.issue = Issue.createIssue({id: 1, title: issueTitle});
        bot.reply(message, 'Lets resolve: ' + issueTitle);
    }

    clearIssue(bot, message) {
        this.issue = null;
        bot.reply(message, 'All issues are cleared');
    }

    addAlternative() {
    }

    voteIssue() {
    }

    listAlternatives() {
    }

}