const socket = io('/lobby');

socket.on('players', (players) => {
    console.log('players', players);
    const player_list = document.getElementById("player_list");
    player_list.innerHTML = "";
    for (const [id, nickname] of Object.entries(players)) {
        player_list.innerHTML += `<li>${nickname}</li>`;
    }
})

const share_button = document.getElementById("share");
share_button.addEventListener('click', () => {
    navigator.clipboard.writeText(document.URL.replace('lobby', 'index'));
})

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? matches[1] : undefined;
}

const captain = getCookie('captain');
const roomId = getCookie('roomId');

const urlParams = new URLSearchParams(window.location.search);

const start_button = document.getElementById("start");

if (captain == 1 && roomId == urlParams.get('roomId')) {
    start_button.addEventListener('click', () => {
        socket.emit('start');
    })
}

socket.on('login', () => {
    window.location.replace(document.URL.replace('lobby', 'index'));
})

socket.on('start', () => {
    window.location.replace(document.URL.replace('lobby', 'choseong'));
})