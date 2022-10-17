var mem = {
    hWrap: null,
    url: '../ttkeele.github.io/images/',
    sets: 6,
    grid: [],
    moves: 0,
    matched: 0,
    last: null,
    lock: null,
    hint: 1000,

    preload: () => {
        mem.hWrap = document.getElementById('mem-game');

        let img, loaded = -1;
        for (let i = 0; i <= mem.sets; i++) {
            img = document.createElement('img');
            img.onload = () => {
                loaded++;
                if (loaded == mem.sets) {
                    mem.reset();
                }
            };
            img.src = `${mem.url}spiderman-${i}.jpg`;
        }
    },

    reset: () => {
        clearTimeout(mem.lock);
        mem.lock = null;
        mem.moves = 0;
        mem.matched = 0;
        mem.last = null;
        mem.grid = [];
        for (let s = 1; s <= mem.sets; s++) {
            mem.grid.push(s);
            mem.grid.push(s);
        }

        let current = mem.sets * 2,
            temp, random;
        while (0 !== current) {
            random = Math.floor(Math.random() * current);
            current -= 1;
            temp = mem.grid[current];
            mem.grid[current] = mem.grid[random];
            mem.grid[random] = temp;
        }
        // console.log(mem.grid); // CHEAT

        mem.hWrap.innerHTML = '';
        for (let id in mem.grid) {
            let card = document.createElement('img');
            card.className = 'mem-card';
            card.src = `${mem.url}spiderman-0.jpg`;
            card.onclick = () => {
                mem.open(card);
            };
            card.set = mem.grid[id];
            card.open = false;
            mem.hWrap.appendChild(card);
            mem.grid[id] = card;
        }
    },

    open: card => {
        if (mem.lock == null) {
            if (!card.open) {
                card.open = true;
                mem.moves++;
                card.src = `${mem.url}spiderman-${card.set}.jpg`;
                card.classList.add('open');

                if (mem.last == null) {
                    mem.last = card;
                } else {
                    card.classList.remove('open');
                    mem.last.classList.remove('open');

                    if (card.set == mem.last.set) {
                        mem.matched++;
                        card.classList.add('right');
                        mem.last.classList.add('right');
                        mem.last = null;

                        if (mem.matched == mem.sets) {
                            alert('You Found All Spidermen! Total Moves: ' + mem.moves);
                            mem.reset();
                        }
                    } else {
                        card.classList.add('wrong');
                        mem.last.classList.add('wrong');
                        mem.lock = setTimeout(() => {
                            card.classList.remove('wrong');
                            mem.last.classList.remove('wrong');
                            card.open = false;
                            mem.last.open = false;
                            card.src = `${mem.url}spiderman-0.jpg`;
                            mem.last.src = `${mem.url}spiderman-0.jpg`;
                            mem.last = null;
                            mem.lock = null;
                        }, mem.hint);
                    }
                }
            }
        }
    },
};
window.addEventListener("DOMContentLoaded", mem.preload);
