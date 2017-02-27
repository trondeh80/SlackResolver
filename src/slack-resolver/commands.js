export default class Commands {

    constructor(slackResolver){
        this.slackResolver = slackResolver;
    }

    reply(output){
        this.slackResolver.sendReply(output) ;
    }

    // For generating command objects
    static createCommand(command){
        return {
            uid: Symbol(),
            commands: [],
            response: false,
            method: null,
            listeningMethods: false,
            ...command
        }
    }
}