// imports
const apiai = require('apiai')('9a638e79385a4377b4d307b1cd3b1940');

// initialize webspeech
if (window.SpeechRecognition === null ){
    console.log("Speech Recognition is not supported.");
}else {
    console.log('Speech Recognition is working!!!');
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
console.log(recognition ? 'SpeechRecognition initialized' : 'Error initializing SpeechRecognition');

// DOM elements
const breakLine = '<br>';
var sendBtn = document.getElementById('btn-send');
var talkBtn = document.getElementById('btn-talk');
var stopBtn = document.getElementById('btn-stop');
stopBtn.style.display = 'none';
var conversation = document.getElementById('conversation');
var messageInput = document.getElementById('write-message');
messageInput.focus();

// config webspeech
recognition.lang = 'es-ES';
recognition.language = 'Spanish';
recognition.interimResults = false;
recognition.continuous = true;

recognition.onstart = () => { console.log('Recognition START') }
recognition.onresult = () => { console.log('Recognition RESULTS') }
recognition.onerror = (e) => { console.log('Recognition ERROR', e.error) }
recognition.onend = () => { 
    talkBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
    console.log('Recognition END');
}


// events
talkBtn.addEventListener('click', () => {
    recognition.start();
    stopBtn.style.display = 'inline';
    talkBtn.style.display = 'none';
});
stopBtn.addEventListener('click', () => {
    recognition.stop();
    talkBtn.style.display = 'inline';
    stopBtn.style.display = 'none';
});
sendBtn.addEventListener('click', () => {
    var text = messageInput.value;
    messageInput.value = '';
    sendMessage(text);
});
messageInput.onkeydown = function(e) {
    if (e.keyCode == 13) {
        var text = messageInput.value;
        messageInput.value = '';
        sendMessage(text);
    }
};

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log('Result received: ' + text);
    console.log('Confidence: ' + e.results[0][0].confidence);
    sendMessage(text);
});


// functions
function sendMessage(text) {
    if (!text || text.length <= 0) {
        messageInput.focus();
        return;
    }
    printMessage(text, false);
    // socket.emit('chat message', text);
    messageInput.focus();
    console.log('Sending message to server: ', text);
    var sessionID = new Date().getTime();
    // console.log('chat message', text, sessionID);

    // get reply from DialogFlow
    let apiaiReq = apiai.textRequest(text, {
        sessionId: sessionID //APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
        let replyText = response.result.fulfillment.speech;
        console.log('Bot reply', replyText);
        recognition.stop();
        talkBtn.style.display = 'inline';
        stopBtn.style.display = 'none';
        printMessage(replyText, true);
        synthVoice(replyText);
    });

    apiaiReq.on('error', (error) => {
        console.log(error);
    });
    apiaiReq.end();
}

function printMessage(text, isBot) {
    conversation.innerHTML += getHtmlMessage(text, isBot);
    scrollConversationToBottom();
}

function getHtmlMessage(text, isBot) {
    var subject = isBot ? 'WONKI' : 'YOU';
    var customClass = isBot ? 'msg-wonki' : 'msg-you';
    return `
        <p class="message ${customClass}">
            <strong>${subject}</strong>: ${text} ${breakLine}
        </p>
    `;
}

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

function scrollConversationToBottom() {
    conversation.scrollTop = conversation.scrollHeight;
}
