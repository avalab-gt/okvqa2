let trainAnnotationsLink = "./Data/ok-vqa_dataset/mscoco_train2014_annotations.json";
let trainQuestionsLink = "./Data/ok-vqa_dataset/OpenEnded_mscoco_train2014_questions.json";
let valAnnotationsLink = "./Data/ok-vqa_dataset/mscoco_val2014_annotations.json";
let valQuestionsLink = "./Data/ok-vqa_dataset/OpenEnded_mscoco_val2014_questions.json";

let trainAnnotationsLink2 = "./Data/ok-vqa_dataset2/mscoco_train2014_answersv2.json";
let trainQuestionsLink2 = "./Data/ok-vqa_dataset2/OpenEnded_mscoco_train2014_questionsv2.json";
let valAnnotationsLink2 = "./Data/ok-vqa_dataset2/mscoco_val2014_answersv2.json";
let valQuestionsLink2 = "./Data/ok-vqa_dataset2/OpenEnded_mscoco_val2014_questionsv2.json";

var finished = 0

var trainAnnotations = $.getJSON({'url': trainAnnotationsLink, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

var trainQuestions = $.getJSON({'url': trainQuestionsLink, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

var valAnnotations = $.getJSON({'url': valAnnotationsLink, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

var valQuestions = $.getJSON({'url': valQuestionsLink, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

var trainAnnotations2 = $.getJSON({'url': trainAnnotationsLink2, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

var trainQuestions2 = $.getJSON({'url': trainQuestionsLink2, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

var valAnnotations2 = $.getJSON({'url': valAnnotationsLink2, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}) 

var valQuestions2 = $.getJSON({'url': valQuestionsLink2, 'async': true}, null, () => {
    finished = finished + 1
    continueSetup()
}); 

trainImagesDownload = document.getElementById("trainImages")
valImagesDownload = document.getElementById("valImages")

test = 0

var trainImagesPath = "./Data/train2014/"
var valImagesPath = "./Data/val2014/"


const zeroPad = (num, places) => String(num).padStart(places, '0')

const imageMap = new Map();

var trainDatapoints = []
var valDatapoints = []

behind = 0


function continueSetup() {
    if (finished != 8) {
        return
    }
    trainAnnotations = (trainAnnotations.responseJSON)
    trainQuestions = (trainQuestions.responseJSON)
    valAnnotations = (valAnnotations.responseJSON)
    valQuestions = (valQuestions.responseJSON)
    trainAnnotations2 = (trainAnnotations2.responseJSON)
    trainQuestions2 = (trainQuestions2.responseJSON)
    valAnnotations2 = (valAnnotations2.responseJSON)
    valQuestions2 = (valQuestions2.responseJSON)

    for (var i = 0; i < Object.keys(trainAnnotations.annotations).length; i++) {
        var question = trainQuestions.questions[i].question
    
        img = trainAnnotations.annotations[i].image_id
        img = trainImagesPath + zeroPad(img, 12) + ".jpg"

        var answers = []
        var answersWeights = []

        answers.push(trainAnnotations.annotations[i].answers[0].answer)
        answersWeights.push(1)

        for(var x = 1; x < 10; x++) {
            if (trainAnnotations.annotations[i].answers[x].answer === trainAnnotations.annotations[i].answers[x-1].answer) {
                answersWeights[answersWeights.length - 1] = answersWeights[answersWeights.length - 1] + 1
            } else {
                answers.push(trainAnnotations.annotations[i].answers[x].answer)
                answersWeights.push(1)
            }
        }

        var cur = new VQADatapoint(question, answers, answersWeights, img)
        cur.type="training"
        imageMap.set(img, cur)

        if (trainQuestions2.questions[i - behind] ==  undefined) {
            continue
        }
        var question = trainQuestions2.questions[i - behind].question
    
        img = trainAnnotations2.annotations[i - behind].image_id
        img = trainImagesPath + zeroPad(img, 12) + ".jpg"


        var answers = []
        var answersWeights = []

        answers.push(trainAnnotations2.annotations[i - behind].answers[0].answer)
        answersWeights.push(1)
        for(var x = 1; x < 5; x++) {
            if (trainAnnotations2.annotations[i - behind].answers[x].answer === trainAnnotations2.annotations[i - behind].answers[x-1].answer) {
                answersWeights[answersWeights.length - 1] = answersWeights[answersWeights.length - 1] + 1
            } else {
                answers.push(trainAnnotations2.annotations[i - behind].answers[x].answer)
                answersWeights.push(1)
            }
        }
        point = imageMap.get(img)

        if (point == undefined) {
            behind = behind + 1
            continue
        }

        point.questionId = trainAnnotations2.annotations[i - behind].question_id
        point.wiki = trainAnnotations2.annotations[i - behind].wikipedia
        point.unsure = trainAnnotations2.annotations[i - behind].answer_status
        point.newAnswers = answers
        point.newQuestion = question
        point.newWeights = answersWeights
        point.unsure_remove = trainQuestions2.questions[i - behind].question_status
        point.changed = ((JSON.stringify(answers) == JSON.stringify(point.answers)) ? "unchanged" : "changed")
        point.qChanged = ((JSON.stringify(point.question) == JSON.stringify(point.newQuestion)) ? "unchanged" : "qChanged")
        point.normal = point.unsure != "unsure" && point.unsure_remove != "unsure_remove" && point.newAnswers != undefined


        trainDatapoints.push(cur)
    }

    for (var i = 0; i < Object.keys(valAnnotations.annotations).length; i++) {
        var question = valQuestions.questions[i].question
    
        img = valAnnotations.annotations[i].image_id
        img = valImagesPath + zeroPad(img, 12) + ".jpg"


        var answers = []
        var answersWeights = []

        answers.push(valAnnotations.annotations[i].answers[0].answer)
        answersWeights.push(1)

        for(var x = 1; x < 10; x++) {
            if (valAnnotations.annotations[i].answers[x].answer === valAnnotations.annotations[i].answers[x-1].answer) {
                answersWeights[answersWeights.length - 1] = answersWeights[answersWeights.length - 1] + 1
            } else {
                answers.push(valAnnotations.annotations[i].answers[x].answer)
                answersWeights.push(1)
            }
        }

        var cur = new VQADatapoint(question, answers, answersWeights, img)
        cur.type="validation"
        imageMap.set(img, cur)

        if (valQuestions2.questions[i - behind] ==  undefined) {
            continue
        }
        var question = valQuestions2.questions[i - behind].question
    
        img = valAnnotations2.annotations[i - behind].image_id
        img = valImagesPath + zeroPad(img, 12) + ".jpg"


        var answers = []
        var answersWeights = []

        answers.push(valAnnotations2.annotations[i - behind].answers[0].answer)
        answersWeights.push(1)
        for(var x = 1; x < 5; x++) {
            if (valAnnotations2.annotations[i - behind].answers[x].answer === valAnnotations2.annotations[i - behind].answers[x-1].answer) {
                answersWeights[answersWeights.length - 1] = answersWeights[answersWeights.length - 1] + 1
            } else {
                answers.push(valAnnotations2.annotations[i - behind].answers[x].answer)
                answersWeights.push(1)
            }
        }

        point = imageMap.get(img)

        if (point == undefined) {
            behind = behind + 1
            continue
        }

        point.questionId = valAnnotations2.annotations[i - behind].question_id
        point.wiki = valAnnotations2.annotations[i - behind].wikipedia
        point.unsure = valAnnotations2.annotations[i - behind].answer_status
        point.newAnswers = answers
        point.newQuestion = question
        point.newWeights = answersWeights
        point.question_status = valAnnotations2.annotations[i - behind].question_status
        point.unsure_remove = valQuestions2.questions[i - behind].question_status
        point.changed = ((JSON.stringify(answers) == JSON.stringify(point.answers)) ? "unchanged" : "changed")
        point.qChanged = ((JSON.stringify(point.question) == JSON.stringify(point.newQuestion)) ? "unchanged" : "qChanged")
        point.normal = point.unsure != "unsure" && point.unsure_remove != "unsure_remove" && point.newAnswers != undefined
        point.type = "validation"

        valDatapoints.push(cur)
    }
    console.log(imageMap)
}


$('#buttons .dropdown-menu').on({
	"click":function(e){
      e.stopPropagation();
    }
});
$('.closer').on('click', function () {
    $('.btn-group').removeClass('open');
});