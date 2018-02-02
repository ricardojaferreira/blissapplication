
'use strict'

let dummy = document.querySelector('h1');
let loading = document.querySelector('#loading-block');
let retryBlock = document.querySelector('#retry-block');
let retryButton = document.querySelector('#retryConnection');
retryButton.addEventListener('click', connectAPI.bind(this, 'GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/health'));

connectAPI('GET', 'https://private-anon-14dd947258-blissrecruitmentapi.apiary-mock.com/health');

function connectAPI(method, uri){
    loading.style.display = 'block';
    retryBlock.style.display = 'none';
    let request = new XMLHttpRequest();
    request.open(method, uri);
    request.timeout = 5000;
    request.addEventListener('readystatechange', statechange);
    request.addEventListener('timeout', con_timeout);
    request.send();
}

function statechange() {
    if (this.readyState === 4) {
        console.log('Status:', this.status);
        console.log('Headers:', this.getAllResponseHeaders());
        console.log('Body:', this.responseText);
        if(this.status == 200){
            loading.style.display = 'none';
            window.location = "/blissapplication/question/";
        }else{
            if(this.status == 503){
                loading.style.display = 'none';
                retryBlock.style.display = 'block';
            }
        }
    }
}

function con_timeout(){
    loading.style.display = 'none';
    retryBlock.style.display = 'block';
}