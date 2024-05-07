const socket = io('/lobby');

const share_button = document.getElementById("share");
share_button.addEventListener('click', () => {
    navigator.clipboard.writeText(document.URL.replace('lobby', 'index'));
})

// function getCookie(name) {
//     let matches = document.cookie.match(new RegExp(
//         "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//     ));
//     return matches ? matches[1] : undefined;
// }

// const nickname = getCookie('nickname');

socket.on('players', (players) => {
    console.log('players', players);
    const player_list = document.getElementById("player_list");
    player_list.innerHTML = "";
    for (const [id, nickname] of Object.entries(players)) {
        player_list.innerHTML += `<li>${nickname}</li>`;
    }
})