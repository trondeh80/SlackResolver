export default class Issue {

    // Returns a new issue object.
    static createIssue(options) {
        return {
            ...options,
            title: null,
            alternatives: [],
            responses: [],
            resolved: false,
            start: new Date(),
            end: void 0
        }
    }

}