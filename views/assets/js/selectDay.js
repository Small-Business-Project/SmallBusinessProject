const grid = document.querySelector('.gridContainer');


let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let today = new Date();
let currentMonth = monthNames[today.getMonth()];
let numberOfDays = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();

let curDay;

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function generateDays(cont, date){
    removeAllChildNodes(cont);
    for(let i=1; i<=numberOfDays; i++) {
        let linkCont = document.createElement('div');
        linkCont.classList.add("day");
        let link = document.createElement('a');
        link.classList.add("day--link");
        curDay = currentMonth + '-' + i;
        link.id = curDay;
        link.href = curDay;
        link.textContent = currentMonth + ' ' + i;
        linkCont.appendChild(link);
        cont.appendChild(linkCont);
        let year = document.querySelector('.year');
        year.textContent = date.getFullYear();
    }
}
generateDays(grid, today);
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

next.addEventListener('click', function(){
    today.setMonth(today.getMonth() < 11 ? today.getMonth() + 1 : 0);
    today.setFullYear(today.getMonth() > 0 ? today.getFullYear() : today.getFullYear() + 1)
    currentMonth = monthNames[today.getMonth()];
    numberOfDays = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    generateDays(grid, today);
})

prev.addEventListener('click', function(){
    today.setMonth(today.getMonth() > 0 ? today.getMonth() - 1 : 11);
    today.setFullYear(today.getMonth() < 11 ? today.getFullYear() : today.getFullYear() - 1)
    currentMonth = monthNames[today.getMonth()];
    numberOfDays = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    generateDays(grid, today);
})

