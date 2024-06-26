const socket = io('/choseong');

const qnas = [
    { "question": "ㅅㅇㄲ", "answer": "%EC%83%88%EC%9A%B0%EA%B9%A1" },
    { "question": "ㄲㄱㄹ", "answer": "%EA%BD%83%EA%B2%8C%EB%9E%91" },
    { "question": "ㅇㅈㅇㄸㅋ", "answer": "%EC%98%A4%EC%A7%95%EC%96%B4%EB%95%85%EC%BD%A9" },
    { "question": "ㅁㄷㅅ", "answer": "%EB%A7%9B%EB%8F%99%EC%82%B0" },
    { "question": "ㅈㄱㅊ", "answer": "%EC%9E%90%EA%B0%88%EC%B9%98" },
    { "question": "ㅇㅈㅇㅈ", "answer": "%EC%98%A4%EC%A7%95%EC%96%B4%EC%A7%91" },
    { "question": "ㅇㅇ", "answer": "%EC%98%A4%EC%9E%89" },
    { "question": "ㅊㅋㅍ", "answer": "%EC%B9%98%ED%82%A8%ED%8C%9D" },
    { "question": "ㅍㅋㅊ", "answer": "%ED%8F%AC%EC%B9%B4%EC%B9%A9" },
    { "question": "ㄲㄲㅋ", "answer": "%EA%BC%AC%EA%B9%94%EC%BD%98" },
];

let cur_qna = {};

const showQuestion = (idx) => {
    cur_qna = qnas[idx];
    const question = document.getElementById("question");
    question.innerText = cur_qna.question;
}

const checkAnswer = (event) => {
    event.preventDefault();

    const user_answer = document.getElementById("user_answer");
    if (encodeURI(user_answer.value) != cur_qna.answer) {
        socket.emit('chat message', user_answer.value);
    }
    else {
        socket.emit('answer message', user_answer.value);
    }

    user_answer.value = "";
}

socket.on('question message', (idx) => {
    showQuestion(idx);
})

const chat = document.getElementById("chat");
socket.on('chat message', (message) => {
    chat.innerText += message + "\n";
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
})

const answer_form = document.getElementById("answer_form");
answer_form.addEventListener("submit", checkAnswer);

socket.on('login', () => {
    window.location.replace(document.URL.replace('choseong', 'index'));
})

window.onload = () => {
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? matches[1] : undefined;
    }
    const captain = getCookie('captain');
    const roomId = getCookie('roomId');
    const urlParams = new URLSearchParams(window.location.search);
    if (captain == 1 && roomId == urlParams.get('roomId')) {
        socket.emit('answer message', '문제');
    }
}