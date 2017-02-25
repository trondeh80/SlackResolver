import SlackResolver from './slack-resolver/slack-resolver' ;
import getConfig from './config';

const resolver = new SlackResolver(getConfig());
resolver.start();