export default class GhostCommands {

    constructor(slackResolver) {
        this.slackResolver = slackResolver;
    }

    getCommands() {
        return [
            {commands: ['CATS!'], response: 'https://youtu.be/UBIc7P_Bnf8'},
            {commands: ['RTFM'], response: 'https://nerddrivel.files.wordpress.com/2013/05/moses-rtfm.jpg'},
            {commands: ['get rect'], response: 'https://i.redd.it/l8fyqjfnv3iy.png'},
            {commands: ['dateformat'], response: 'https://i.imgur.com/9jGxnbB.png'},
            {commands: ['notbad'], response: 'https://images.vice.com/vice/images/content-images/2015/07/08/memes-tk-body-image-1436382157.jpg'},
        ];
    }

}