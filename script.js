const API_KEY = '00bbee27460f4a50be3d9b6b04248315';

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


function stripHtmlTags(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || "";
}


function fetchGamesForMonth(year, month) {
    
    document.getElementById('prevMonth').style.display = (month <= new Date().getMonth() - 1 && year === new Date().getFullYear()) ? 'none' : 'block';
    document.getElementById('nextMonth').style.display = (month >= new Date().getMonth() + 1 && year === new Date().getFullYear()) ? 'none' : 'block';

    
    fetch(`https://api.rawg.io/api/games?dates=${year}-${month + 1}-01,${year}-${month + 1}-30&key=${API_KEY}`).then(response => response.json()).then(data => {
        
        const games = data.results.filter(game => game.background_image);

        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let htmlContent = '';
        for (let i = 1; i <= daysInMonth; i++) {
            let gamesForDay = games.filter(game => new Date(game.released).getDate() === i);

            htmlContent += `

            <div class="date">
                <strong>${i}</strong>
                ${gamesForDay.map(game => `
                    <div class="game" data-id="${game.id}">
                        <img src="${game.background_image}" alt="${game.name} Thumbnail">
                        <div class="game-details">${game.name}</div>
                    </div>
                `).join('')}
            </div>
            `;
        }

        document.getElementById('calendar').innerHTML = htmlContent;
        document.getElementById('currentMonthYear').innerText = `${monthNames[month]} ${year}`;

        
        document.querySelectorAll('.game').forEach(gameEl => {
            gameEl.addEventListener('click', () => {
                const gameId = gameEl.getAttribute('data-id');

                
                fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`).then(response => response.json()).then(gameDetails => {
                    document.getElementById('gameTitle').innerText = gameDetails.name;
                    document.getElementById('gameImage').src = gameDetails.background_image;

                    const descriptionElement = document.querySelector('.modal-content p strong');
                    descriptionElement.nextSibling.nodeValue = " " + stripHtmlTags(gameDetails.description || "Kuvausta ei ole saatavilla.");

                    document.getElementById('gameReleaseDate').innerText = gameDetails.released;
                    document.getElementById('gameRating').innerText = gameDetails.rating;
                    document.getElementById('gamePlatforms').innerText = gameDetails.platforms.map(platform => platform.platform.name).join(', ');
                    document.getElementById('gameModal').style.display = 'block';
                });
            });
        });
    });
}

const monthNames = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    fetchGamesForMonth(currentYear, currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    fetchGamesForMonth(currentYear, currentMonth);
});


document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('gameModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('gameModal')) {
        document.getElementById('gameModal').style.display = 'none';
    }
});

fetchGamesForMonth(currentYear, currentMonth);
