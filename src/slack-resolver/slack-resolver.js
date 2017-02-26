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

        const listeningMethods = 'direct_message,direct_mention,mention';

        // Resolving commands:
        this.controller.hears(['Resolve:'], listeningMethods, this.runCommand(this.createIssue.bind(this)));
        this.controller.hears(['Conclude!', 'Conclude:'], listeningMethods, this.runCommand(this.concludeIssue.bind(this)));
        this.controller.hears(['ClearIssues'], listeningMethods, this.runCommand(this.clearIssue.bind(this)));
        this.controller.hears(['AddAlternative:'], listeningMethods, this.runCommand(this.addAlternative.bind(this)));
        this.controller.hears(['Vote:'], listeningMethods, this.runCommand(this.voteAlternative.bind(this)));
        this.controller.hears(['ListAlternatives'], listeningMethods, this.runCommand(this.listAlternatives.bind(this)));

        // help
        this.controller.hears(['HelpResolve'], listeningMethods, this.runCommand(this.showHelp.bind(this)));

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

    showHelp() {
        this.sendReply(`Resolver polls a group for a conclusion. Here are the commands
"Resolve: <issue>" - will create a new poll
"AddAlternative: <alternative>" - Adds an alternative to the poll
"Vote: <alternativeNumber>" - Registeres your vote on the alternative
"ListAlternatives" - lists all available alternatives and their votes
"ClearIssues" - will reset the poll
"Conclude! - will finish the poll and present the winner"`);
    }

    createIssue(message) {
        if (this.issue && !this.issue.resolved) {
            return this.sendReply(`Current issue is not resolved: ${this.issue.title}. (To clear, type "ClearIssues")`);
        }
        const issueTitle = message.text.replace(/Resolve\:/, '').trim();
        this.issue = Issue.createIssue({id: 1, title: issueTitle});
        this.sendReply(`Lets resolve: ${issueTitle}`);
        console.log(`Created new issue: "${issueTitle}"`);
    }

    clearIssue() {
        this.issue = null;
        this.sendReply('All issues are cleared');
    }

    addAlternative(message) {
        const alternativeTitle = message.text.replace(/AddAlternative\:/, '').trim();
        const existingAlternative = this.issue.alternatives.find((alt) => {
            return alt.title === alternativeTitle;
        });
        if (existingAlternative) {
            return this.sendReply(`${alternativeTitle} is allready listed`);
        }

        this.issue.alternatives.push(Issue.createAlternative({title: alternativeTitle}));

        this.sendReply(`Alternative '${alternativeTitle}' has been added`);
    }

    voteAlternative(message) {
        const vote = message.text.replace('Vote:', '').trim();
        const alternative = this.issue.alternatives.find((alt, index) => {
            return index + 1 === Number.parseInt(vote);
        });

        if (alternative) {
            alternative.votes++;
            if (this.hasVoted()) {
                this.issue.voters[this.activeUserId].votes--;
            }
            this.issue.voters[this.activeUserId] = alternative;
            this.sendReply(`Vote received.`);
            this.listAlternatives();

        } else {

            this.sendReply(`Your vote for #${vote} is not in the list!`);
            this.listAlternatives();

        }
    }

    listAlternatives() {
        if (!this.issue) {
            return this.sendReply('There are no issues up for vote.');
        }
        let listReply = `Ok, here are the current alternatives for "${this.issue.title}"`;
        this.issue.alternatives.forEach((item, index) => {
            const humanIndex = index + 1;
            listReply += `\n#${humanIndex}: ${item.title} has received ${item.votes} votes`;
        });
        this.sendReply(listReply);
    }

    concludeIssue() {
        let maxVotes = 0;
        this.issue.alternatives.forEach((alt, index) => {
            if (alt.votes > maxVotes) {
                maxVotes = alt.votes;
                this.issue.winnerIndex = index;
            }
        });
        if (this.issue.winnerIndex > -1) {
            this.issue.resolved = true;
            this.sendReply(`Conclusion: ${this.issue.alternatives[this.issue.winnerIndex].title}`);
        } else {
            this.sendReply('Issue not concluded yet');
        }
    }

    sendReply(output) {
        this.bot.reply(this.message, output)
    }

    hasVoted() {
        return !!this.issue.voters[this.activeUserId];
    }

    readManual() {
        this.sendReply('https://nerddrivel.files.wordpress.com/2013/05/moses-rtfm.jpg');
    }

}