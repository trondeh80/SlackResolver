import Commands from './commands' ;

export default class RemoteCommands extends Commands {

    constructor(slackResolver) {
        super(slackResolver);
        this.sayRegExp = /^say@([^:\s]*)?[\s|:\s]+(.*)/g;
    }

    getCommands() {
        return [
            Commands.createCommand({commands: ['say@'], method: this.sayInChannel.bind(this)})
        ];
    }

    sayInChannel(message) {
        const text = message.text.replace(this.sayRegExp, '').trim();
        const channel = message.match[0].replace('say@', '').replace(':', '').trim();

        this.slackResolver.bot.api.chat.postMessage({channel, text}, (err, res) => {
            if (!res.ok){
                return this.reply(`Unable to send message: '${err}'`) ;
            } else {
                return this.reply('Message sent :)') ;
            }
        });
    }

}