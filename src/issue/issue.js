export default class Issue {

    // Returns a new issue object.
    static createIssue(options) {
        return {
            title: null,
            alternatives: [],
            voters: [],
            resolved: false,
            start: new Date(),
            end: void 0,
            winnerIndex: -1,
            ...options
        }
    }

    static createAlternative(options) {
        return {
            uid: Symbol(),
            title: null,
            votes: 0,
            dateAdded: new Date(),
            ...options
        }
    }
}