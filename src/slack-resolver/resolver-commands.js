import Issue from '../issue/issue' ;

export default class ResolverCommands {

    constructor(slackResolver) {
        this.slackResolver = slackResolver;
    }

    getCommands() {
        return [
            {commands: ['Resolve:'], method: this.createIssue.bind(this)},
            {commands: ['Conclude!', 'Conclude:'], method: this.concludeIssue.bind(this)},
            {commands: ['AddAlternative:'], method: this.addAlternative.bind(this)},
            {commands: ['Vote:'], method: this.voteAlternative.bind(this)},
            {commands: ['ListAlternatives'], method: this.listAlternatives.bind(this)},
            {commands: ['ClearIssues'], method: this.clearIssue.bind(this)},
            {commands: ['HelpResolve'], method: this.showHelp.bind(this)},
        ];
    }

    createIssue(message) {
        if (this.issue && !this.issue.resolved) {
            return this.reply(`Current issue is not resolved: ${this.issue.title}. (To clear, type "ClearIssues")`);
        }
        const issueTitle = message.text.replace(/Resolve:/, '').trim();
        this.issue = Issue.createIssue({id: 1, title: issueTitle});
        this.reply(`Lets resolve: ${issueTitle}`);
    }

    clearIssue() {
        this.issue = null;
        this.reply('All issues are cleared');
    }

    addAlternative(message) {
        const alternativeTitle = message.text.replace(/AddAlternative:/, '').trim();
        if (!this.issue){
            console.log(typeof(this.issue.alternatives)) ;
            return this.reply('You need to create an issue first using "Resolve: <issue text>"') ;
        }

        const existingAlternative = this.issue.alternatives.find((alt) => {
            return alt.title === alternativeTitle;
        });
        if (existingAlternative) {
            return this.reply(`${alternativeTitle} is allready listed`);
        }

        this.issue.alternatives.push(Issue.createAlternative({title: alternativeTitle}));
        this.reply(`Alternative '${alternativeTitle}' has been added`);
    }

    voteAlternative(message) {
        const vote = message.text.replace(/Vote:/, '').trim();
        const alternative = this.issue.alternatives.find((alt, index) => (index + 1 === Number.parseInt(vote)));

        if (alternative) {
            alternative.votes++;
            if (this.hasVoted()) {
                this.issue.voters[this.activeUserId].votes--;
            }
            this.issue.voters[this.activeUserId] = alternative;
            this.reply(`Vote received.`);
            this.listAlternatives();

        } else {

            this.reply(`Your vote for #${vote} is not in the list!`);
            this.listAlternatives();

        }
    }

    listAlternatives() {
        if (!this.issue) {
            return this.reply('There are no issues up for vote.');
        }
        let listReply = `Ok, here are the current alternatives for "${this.issue.title}"`;
        this.issue.alternatives.forEach((item, index) => {
            const humanIndex = index + 1;
            listReply += `\n#${humanIndex}: ${item.title} has received ${item.votes} votes`;
        });
        this.reply(listReply);
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
            this.reply(`Conclusion: ${this.issue.alternatives[this.issue.winnerIndex].title}`);
        } else {
            this.reply('Issue not concluded yet');
        }
    }

    hasVoted() {
        return !!this.issue.voters[this.activeUserId];
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

    reply(msg){
        this.slackResolver.sendReply(msg) ;
    }

}