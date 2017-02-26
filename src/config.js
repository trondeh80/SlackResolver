import {getSlackToken} from './env' ;

export default function getConfig(options = {}){
    return {...options,
        token: getSlackToken()
    }
}