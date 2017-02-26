import {SLACK_API_TOKEN} from './env' ; // Todo: move to process.env and input token in commands that boots app

export default function getConfig(options = {}){
    return {...options,
        token: SLACK_API_TOKEN
    }
}