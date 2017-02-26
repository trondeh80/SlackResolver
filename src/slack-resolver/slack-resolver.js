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
        this.addListeners();
    }

    addListeners() {
        this.controller.hears(['Resolve:'], 'direct_message, direct_mention, mention', this.runCommand(this.createIssue.bind(this)));
        this.controller.hears(['Conclude!', 'Conclude:'], 'direct_message, direct_mention, mention', this.runCommand(this.concludeIssue.bind(this)));
        this.controller.hears(['ClearIssues'], 'direct_message, direct_mention, mention', this.runCommand(this.clearIssue.bind(this)));
        this.controller.hears(['AddAlternative: '], 'direct_message, direct_mention, mention', this.runCommand(this.addAlternative.bind(this)));
        this.controller.hears(['Vote:'], 'direct_message, direct_mention, mention', this.runCommand(this.voteIssue.bind(this)));
        this.controller.hears(['ListAlternatives'], 'direct_message, direct_mention, mention', this.runCommand(this.listAlternatives.bind(this)));
    }

    runCommand(fn) {
        return function (bot, message) {
            console.log('User: ', message.user);
            this.bot = bot ;
            this.message = message;
            this.activeUserId = message.user;
            fn(bot, message);
        }
    }

    createIssue(bot, message) {
        if (this.issue && !this.issue.resolved) {
            return bot.reply(message, `Current issue is not resolved: ${this.issue.title}. (To clear, type "ClearIssues")`);
        }
        const issueTitle = message.text.replace(/Resolve\:/, '');
        this.issue = Issue.createIssue({id: 1, title: issueTitle});
        bot.reply(message, 'Lets resolve: ' + issueTitle);
        console.log(`Created new issue: "${issueTitle}"`);
        console.log(this.title);
    }

    clearIssue(bot, message) {
        this.issue = null;
        bot.reply(message, 'All issues are cleared');
    }

    addAlternative(bot, message) {
        const alternativeTitle = message.text.replace(/AddAlternative\:/, '');
        const existingAlternative = this.issue.alternatives.find((alt) => {
            return alt.title === alternativeTitle;
        });
        if (existingAlternative) {
            return bot.reply(message, `${alternativeTitle} is allready listed`);
        }
        this.issue.alternatives.push(Issue.createAlternative({title: alternativeTitle}));
        bot.reply(message, `Alternative '${alternativeTitle}' has been added`);
    }

    voteIssue(bot, message) {
        const vote = message.text.replace('^Vote:', '').trim();
        const alternative = this.issue.alternatives.find((alt, index) => {
            return index + 1 === Number.parseInt(vote);
        });
        if (alternative && !this.hasVoted()) {
            alternative.votes++;
            this.issue.voters[this.activeUserId] = true;
        }
        bot.reply(message, 'Vote received');
    }

    listAlternatives(bot, message) {
        let listReply = `Ok, here the current alternatives for "${this.issue.title}"`;
        this.issue.alternatives.forEach((item, index) => {
            const humanIndex = index + 1;
            listReply += `\n#${humanIndex}: ${item.title}`;
        });
        bot.reply(message, listReply);
    }

    concludeIssue(){
        this.issue.alternatives.forEach((alt, index) => {
            this.issue.winnerIndex = alt.votes > this.winnerIndex ? index : this.winnerIndex;
        }) ;
        this.reply() ;
    }

    hasVoted() {
        return !!this.issue.voters[this.activeUserId];
    }

    reply(reply){
        this.bot.reply(this.message, reply) ;
    }

}