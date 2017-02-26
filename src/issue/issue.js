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
            ...options
        }
    }

    static createAlternative(options) {
        return {
            title: null,
            votes: 0,
            dateAdded: new Date(),
            ...options
        }
    }
}