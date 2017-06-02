import Commands from './commands' ;

export default class GhostCommands extends Commands {

    constructor(slackResolver) {
        super(slackResolver) ;
    }

    getCommands() {
        return [
            Commands.createCommand({ commands: ['CATS!'], response: 'https://www.youtube.com/watch?v=AGfC68d2114' }),
            Commands.createCommand({ commands: ['RTFM'], response: 'https://nerddrivel.files.wordpress.com/2013/05/moses-rtfm.jpg' }),
            Commands.createCommand({ commands: ['get rect'], response: 'https://i.redd.it/l8fyqjfnv3iy.png' }),
            Commands.createCommand({ commands: ['dateformat'], response: 'https://i.imgur.com/9jGxnbB.png' }),
            Commands.createCommand({ commands: ['notbad'], response: 'https://images.vice.com/vice/images/content-images/2015/07/08/memes-tk-body-image-1436382157.jpg' }),
            Commands.createCommand({ commands: ['hi'], response: 'Hi, I am a bot biip bop' }),
            Commands.createCommand({ commands: ['heavybreathing'], response: 'https://media.giphy.com/media/NnyqfcowpXZOU/giphy.gif' }),
            Commands.createCommand({ commands: ['GAHD'], response: 'https://youtu.be/Xm88rF3GpLg?t=9' }),
        ];
    }

}