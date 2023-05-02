class VQADatapoint {
    constructor(question, answers, weights, image) {
        this.question = question;
        this.answers = answers;
        this.image = image;
        this.weights = weights;  
    }

    compare(otherVGADatapoint) {
        return this.question == otherVGADatapoint.question
        && this.answers == otherVGADatapoint.answers
        && this.image == otherVGADatapoint.image
        && this.wikiSource == otherVGADatapoint.wikiSource
    }
}
