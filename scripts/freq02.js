'use strict'
let date = new Date();

function connectAPI(method, uri){
    loading.style.display = 'block';
    let request = new XMLHttpRequest();
    request.open(method, uri);
    request.timeout = 5000;
    request.addEventListener('readystatechange', statechange);
    request.addEventListener('timeout', con_timeout);
    request.send();
}

/****** Check Server Health ***************/
let loading = document.querySelector('#loading-block');
let checkHealth = document.querySelector('.check-health');
let serverDetails = document.querySelectorAll('#server-health p');
serverDetails[1].innerHTML = 'Last Check: ' + '<br>' + date.getFullYear() + '/'
                                                        + (date.getMonth()+1)    + '/'
                                                        + date.getDate() + ' - '
                                                        + date.getHours() + ':'
                                                        + date.getMinutes() + ':'
                                                        + date.getSeconds();
checkHealth.addEventListener('click', connectAPI.bind(this, 'GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/health'));

function connectAPI(method, uri){
    loading.style.display = 'block';
    let request = new XMLHttpRequest();
    request.open(method, uri);
    request.timeout = 5000;
    request.addEventListener('readystatechange', statechange);
    request.addEventListener('timeout', con_timeout);
    request.send();
}

function statechange() {
    if (this.readyState === 4) {
        let response = JSON.parse(this.responseText);
        if(this.status == 200){
            date = new Date();
            serverDetails[0].innerHTML = 'Status: ' + '<span class="statusOK">' + response.status + '</span>';
            serverDetails[1].innerHTML = 'Last Check: ' + '<br>' + date.getFullYear() + '/'
                                                                    + (date.getMonth()+1)    + '/'
                                                                    + date.getDate() + ' - '
                                                                    + date.getHours() + ':'
                                                                    + date.getMinutes() + ':'
                                                                    + date.getSeconds();
            loading.style.display = 'none';
        }else{
            if(this.status == 503){
                serverDetails[0].innerHTML = 'Status: ' + '<span class="statusNotOK">' + response.status + '</span>';
                serverDetails[1].innerHTML = 'Last Check: ' + '<br>' + date.getFullYear() + '/'
                                                                        + (date.getMonth()+1)    + '/'
                                                                        + date.getDate() + ' - '
                                                                        + date.getHours() + ':'
                                                                        + date.getMinutes() + ':'
                                                                        + date.getSeconds();
                loading.style.display = 'none';
            }
        }
    }
}

function con_timeout(){
    loading.style.display = 'none';
    serverDetails[0].innerHTML = 'Status: ' + '<span class="statusNotOK">' + 'Connection Timeout' + '</span>';
    serverDetails[1].innerHTML = 'Last Check: ' + '<br>' + date.getFullYear() + '/'
        + (date.getMonth()+1)    + '/'
        + date.getDate() + ' - '
        + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds();
    loading.style.display = 'none';
}

/******** Get List Questions **********************/
let detailScreen = document.querySelector('#detail-screen');
let pathArray = window.location.href.split('?');
if(pathArray.length>1) {
    if (pathArray[1].includes('question_id=', 0)) {
        let query = pathArray[1].split('=');
        if(query.length>1){
            if(/\D/.test(query[1])){
                let questID = query[1].substr(0, /\D/.exec(query[1].substr(0)).index);
                retrieveQuestion('GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/questions/' + questID);
            }
            if(/\d/.test(query[1])){
                let questID = query[1];
                retrieveQuestion('GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/questions/' + questID);
            }
        }
    }
}
let questionFilter = document.querySelector('input#question_filter');
let fetch = document.querySelector('button#fetch');
let clearFilter = document.querySelector('button#clearFilter');
fetch.addEventListener('click', filterList);
clearFilter.addEventListener('click', clearFilterList);

function filterList(){
    fetchList('GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/questions?'
                                                                                + questionFilter.value);
}

function clearFilterList(){
    questionFilter.value = '';
    fetchList('GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/questions');
}

if(pathArray.length >= 2){
    questionFilter.value = pathArray[1];
    questionFilter.focus();
    filterList();
}else{
    filterList();
}

function fetchList(method, uri){
    let request = new XMLHttpRequest();

    request.open(method, uri);

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            let list = JSON.parse(this.responseText);
            let listSection = document.querySelector('#list-items');
            if(list.length>10){
                let loadMore = document.createElement('BUTTON');
                loadMore.innerHTML = 'Show More';
                listSection.appendChild(loadMore);
                loadMore.addEventListener('click',function(){
                   populateList(list,10);
                });
                populateList(list,10);
            }else{
                populateList(list,list.length);
            }
        }
    };

    request.send();
}

function populateList(list, quantity){
    let ulVotes = document.querySelector('ul.votes');
    let ulContainer = document.querySelector('ul.records');
    let elements = (ulContainer.childNodes.length-1);
    let elementsToFetch = (ulContainer.childNodes.length-1+quantity);
    for (let i=elements; i<elementsToFetch && i<list.length;i++){
        let liElement = document.createElement('LI');
        liElement.addEventListener('mouseover',function(){
            while(ulVotes.firstChild){
                ulVotes.removeChild(ulVotes.firstChild);
            }
            for (let j=0; j<list[0].choices.length;j++){
                let choice = document.createElement('LI');
                choice.innerHTML = list[0].choices[j].choice + ' <span class="votes-number">'+ list[0].choices[j].votes + '</span>';
                ulVotes.appendChild(choice);
            }
        });
        liElement.addEventListener('mouseout',function(){
            while(ulVotes.firstChild){
                ulVotes.removeChild(ulVotes.firstChild);
            }
        });
        let questLink = document.createElement('A');
        questLink.href = list[i].id;
        questLink.innerHTML = '<span class="quest_id">'+list[i].id+'</span>' + list[i].question;
        questLink.addEventListener('click',function(event){
           event.preventDefault();
            retrieveQuestion('GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/questions/' + event.href);

        });
        liElement.appendChild(questLink);
        ulContainer.appendChild(liElement);
    }
}

function retrieveQuestion(method, uri){
    detailScreen.style.display = 'block';
    let poll = document.querySelector('.question-poll');
    poll.innerHTML = '<i class="fas fa-times"></i>';
    let closeDetail = document.querySelector('#detail-screen .fa-times');
    closeDetail.addEventListener('click', function(){
        detailScreen.style.display = 'none';
        let questionPoll = document.querySelector('.question-poll');
        while(questionPoll.firstChild){
            questionPoll.removeChild(questionPoll.firstChild);
        }
    });
    let request = new XMLHttpRequest();
    request.open(method, uri);

    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            let questName = document.createElement('H3');
            questName.innerHTML = response.question;
            let questID = document.createElement('INPUT');
            questID.type = 'hidden';
            questID.value = response.id;
            questID.id = 'poll-question-id';
            poll.appendChild(questID);
            poll.appendChild(questName);
            for(let i=0; i<response.choices.length; i++){
                let answersContainer = document.createElement('DIV');
                poll.appendChild(answersContainer);
                let answers = document.createElement('INPUT');
                let answersLabel = document.createElement('LABEL');
                answers.type = 'radio';
                answers.name = 'choices';
                answers.id = response.choices[i].choice;
                answers.value = response.choices[i].choice;
                answersLabel.htmlFor = response.choices[i].choice;
                answersLabel.innerHTML = response.choices[i].choice;
                answersContainer.appendChild(answers);
                answersContainer.appendChild(answersLabel);
            }
            let voteBtn = document.createElement('BUTTON');
            voteBtn.innerHTML = 'Vote';
            poll.appendChild(voteBtn);
            voteBtn.addEventListener('click',updateQuestion);

        }
    };

    request.send();
}

function updateQuestion(){
    let questObj = {};
    let questionID = document.querySelector('#poll-question-id');
    let questionName = document.querySelector('.question-poll h3');
    let questionContainers = document.querySelectorAll('#detail-screen .question-poll div');
    let answers = document.querySelectorAll('input[name=choices]');
    questObj.id = questionID.value;
    questObj.image_url = 'https://dummyimage.com/600x400/000/fff.png&text=question+1+image+(600x400)'; //Not sure how to use this parameter
    questObj.thumb_url = 'https://dummyimage.com/120x120/000/fff.png&text=question+1+image+(120x120)'; //Not sure how to use this parameter
    questObj.question = questionName.innerHTML;
    questObj.choices = [];
    let checked = 0;
    for(let i=0; i<answers.length; i++){
        if(answers[i].checked){
            checked = 1;
        }
        questObj.choices.push({choice: answers[i].value,votes: checked});
    }

    let request = new XMLHttpRequest();

    request.open('PUT', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/questions/'+
                                                                                        questionID.value);

    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status===201 && checked!=0) {
            questionContainers.forEach(function(element){
                element.remove();
            });
            questionName.innerHTML="Thank you for Voting!"
        }

        if (this.readyState === 4 && this.status===400){
            //ERROR MESSAGE GOES HERE
        }
    };

    request.send(JSON.stringify(questObj));
}