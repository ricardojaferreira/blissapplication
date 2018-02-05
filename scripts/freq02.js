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

let pathArray = window.location.href.split('?');
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
        liElement.innerHTML = '<a href="question/'+list[i].id+'">' +
            '<span class="quest_id">'+list[i].id+'</span>' +
            list[i].question +
            '</a>'
        ulContainer.appendChild(liElement);
    }
}