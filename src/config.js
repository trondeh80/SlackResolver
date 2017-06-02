import { SLACK_API_TOKEN } from './env' ;

export default function getConfig(options = {}) {
    return {
        ...options,
        token: SLACK_API_TOKEN,
        retry: 10
    }
}