$.getScript({'url': "./JS/VQADatapoint.js", 'async': false}); 
$.getScript({'url': "./JS/DecodeJson.js", 'async': false}); 
var heightImg = 400
var organizeBy = ""
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


var homeButton = document.getElementById("homeButton")
var dataVisualizerButton = document.getElementById("dataVisualizerButton")

var home = document.getElementById("home")
var visualizer = document.getElementById("visBlock")
var visBlock = document.getElementById("visualizer")
var unsureAnswerButton = document.getElementById("unsureAnswer")
var questionRemovButton = document.getElementById("questionRemove")
var changedButton = document.getElementById("changed")
var unsureRemoveButton = document.getElementById("unsureRemove")

var trainingButton = document.getElementById("flexRadioDefault1")
var validationButton = document.getElementById("flexRadioDefault2")
var citationButton = document.getElementById("citationBut")

type = trainingButton.checked ? "training" : "validation"
organizeByName = ""

citationButton.onclick = function(){
    copyToClipboard(` @article{OK-VQAv2,
        title={OK-VQAv2: A Benchmark for Visual Question Answering using World Knowledge},
        author={Benjamin Reichman and Larry Heck},
        journal={arXiv},
        year={2022},
      }`).then(() => console.log('sucecss'))
      .catch(() => console.log('error'));
}

  // return a promise
function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

tippy('#citationBut', {
    content: "Copied to clipboard",
    placement: "bottom",
    trigger: "click",
    onShow(instance) {
      setTimeout(() => {
        instance.hide();
      }, 2000);
    }
  });

homeButton.onclick = function(){
    showHome()
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1)
    window. scrollTo(0, 0);
}

dataVisualizerButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1)
    organizeBy = ""
    startVis()
    window. scrollTo(0, 0);
}

unsureRemoveButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1) + " : Unsure Remove"
    organizeBy = "unsure_remove"
    organizeByName = "Unsure Remove"
    startVis()
    window. scrollTo(0, 0);
}

unsureAnswerButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1) + " : Unsure Answer"
    organizeBy = "unsure"
    organizeByName = "Unsure Answer"
    startVis()
    window. scrollTo(0, 0);
}

questionRemovButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1) + " : Question Remove"
    organizeBy = "undefined"
    organizeByName = "Question Remove"
    startVis()
    window. scrollTo(0, 0);
}

changedButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1) + ": Answers Changed"
    organizeBy = "changed"
    organizeByName = "Answers Changed"
    startVis()
    window. scrollTo(0, 0);
}

trainingButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1) + ": " + organizeByName
    startVis()
    window. scrollTo(0, 0);
}

validationButton.onclick = function(){
    type = trainingButton.checked ? "training" : "validation"
    dataVisualizerButton.innerHTML = "Data Visualizer - " + type.charAt(0).toUpperCase() + type.substring(1) + ": " + organizeByName
    startVis()
    window. scrollTo(0, 0);
}

function startVis() {
    data = Array.from(imageMap.values())
    shuffleArray(data)
    showDataVisualizer()
    visualizer.innerHTML = ""
    addData(15, visualizer)
}

showHome()

function showHome() {
    home.style.display = ""
    visualizer.style.display = "none"
}

function showDataVisualizer() {
    home.style.display = "none"
    visualizer.style.display = ""
}
data = Array.from(imageMap.values())
dataCount = 0;

function addData(i, location) {
    type = trainingButton.checked ? "training" : "validation"
    for (var x = 0; x < i; x++) {
        // console.log(data)
        p = data[dataCount]

        while (organizeBy == "undefined" && p.newAnswers != undefined || (p.type != undefined && p.type != type)) {

            dataCount = dataCount + 1
            p = data[dataCount]
        }

        while ((p.newAnswers == undefined && organizeBy != "undefined") || (organizeBy != "undefined" && organizeBy != "" && p[organizeBy] != organizeBy) || (p.type != undefined && p.type != type)) {
            dataCount = dataCount + 1
            p = data[dataCount]
        }
  
        while((organizeBy == "" && p.normal != true) || (p.type != undefined && p.type != type)) {
            dataCount = dataCount + 1
            p = data[dataCount]
        }

        
        dataCount = dataCount + 1
        modelAnswersDiv = document.createElement("div")
        answersDiv = document.createElement("div")
        answerNew = document.createElement("div")
        answerOld = document.createElement("div")
        question = document.createElement("div")
        outer = document.createElement("div")
        img = document.createElement("img")
        answerNewHeader = document.createElement("div")
        answerOldHeader = document.createElement("div")
        answerNewText = document.createElement("div")
        answerOldText = document.createElement("div")
        typeAndId = document.createElement("div")
        outerVis = document.createElement("div")

        modelAnswersDiv.className = "modelAnswers"
        outerVis.className = "outerVis"
        answersDiv.className = "answers"
        answerNew.className = "newAnswer"
        answerOld.className = "oldAnswer"
        question.className = question.innerHTML + "question"
        outer.className = "visualizer"
        answerNewHeader.className = "headerAnswer"
        answerOldHeader.className = "headerAnswer"
        answerNewText.className = "textAnswer"
        answerOldText.className = "textAnswer"
        img.className = "visImage"

        question.id = dataCount + "question"
        img.id = dataCount + "img"
        answersDiv.id = dataCount + "answers"

        img.style.height = heightImg

        img.src = p.image
        answerNewText.innerHTML = p.newAnswers != undefined ? p.newAnswers.join(", ") : undefined
        answerOldText.innerHTML = p.answers != undefined ? p.answers.join(", ") : undefined
        question.innerHTML = p.question
        answerNewHeader.innerHTML = "New Answers:"
        answerOldHeader.innerHTML = "Old Answers:"
        typeAndId.innerHTML = p.type + " " + p.questionId

        answerNew.appendChild(answerNewHeader)
        answerNew.appendChild(answerNewText)
        answerOld.appendChild(answerOldHeader)
        answerOld.appendChild(answerOldText)

        answersDiv.appendChild(answerOld)
        if (p.newAnswers != undefined) {
            answersDiv.appendChild(answerNew)
        } else {
            answerOld.style.width = "100%"
        }

        outer.appendChild(typeAndId)
        outer.appendChild(question)
        outer.appendChild(img)
        outer.appendChild(answersDiv)
 
        if ((JSON.stringify(p.question) != JSON.stringify(p.newQuestion)) && JSON.stringify(p.newQuestion) != undefined) {
            b = document.createElement("div")
            b.className = "btn btn-secondary override"
            b.type = "submit"
            b.innerHTML = "new question"
            b.id = dataCount
            question.appendChild(b)
            $(document).on('click','#' + dataCount,function(event){
                dataCountHere = (event.target.id)
                qDiv = document.getElementById(dataCountHere + "question")
        
                if ((JSON.stringify(event.target.innerHTML) == JSON.stringify("new question"))) {
                    
                    event.target.innerHTML = "old question"
                    qDiv.innerHTML = data[dataCountHere - 1].newQuestion + event.target.outerHTML
         
                } else {
        
                    event.target.innerHTML = "new question"
                    qDiv.innerHTML = data[dataCountHere - 1].question + event.target.outerHTML

                }
            })
        }

        img.onload = function() {
            id = parseInt(this.id)
            question = document.getElementById(id + "question")
            answerDiv = document.getElementById(id + "answers")
            ratio = this.width / this.height
            newWidth = ratio * heightImg
            question.style.width = newWidth
            answerDiv.style.width = newWidth
            
        }
        outerVis.appendChild(outer)
        location.innerHTML = location.innerHTML + outerVis.outerHTML
    }
}


$(window).scroll(function() {
    if ($(window).scrollTop() >= .6 * (document.getElementById("body").offsetHeight - document.getElementById("body").clientHeight) && visualizer.style.display == ""){
        addData(15, visualizer)
    }
})