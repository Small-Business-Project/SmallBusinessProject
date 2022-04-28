const grid = document.querySelector('.gridContainer');


let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let today = new Date();
let currentMonth = monthNames[today.getMonth()];
let numberOfDays = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDay();


let curDay;

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function generateDaysofPreviousMonth(cont){
    const numberOfDaysOfPrev = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    let startDay = numberOfDaysOfPrev - firstDayOfMonth;
    let prevMonth = today.getMonth() > 0 ? today.getMonth() - 1 : 11;
    for(startDay; startDay<numberOfDaysOfPrev; startDay++) {
        let linkCont = document.createElement('div');
        linkCont.classList.add("day");
        linkCont.classList.add("prevMonth");
        let link = document.createElement('a');
        link.classList.add("day--link");
        curDay = monthNames[prevMonth] + '-' + startDay;
        link.id = curDay;
        link.href = curDay;
        link.textContent = startDay;
        linkCont.appendChild(link);
        cont.appendChild(linkCont);
    }
}
function generateDaysofNextMonth(cont){
    let endDay = 6 - lastDayOfMonth;
    let nextMonth = today.getMonth() < 11 ? today.getMonth() + 1 : 0;
    for(let startDay=1; startDay<=endDay; startDay++) {
        let linkCont = document.createElement('div');
        linkCont.classList.add("day");
        linkCont.classList.add("nextMonth");
        let link = document.createElement('a');
        link.classList.add("day--link");
        curDay = monthNames[nextMonth] + '-' + startDay;
        link.id = curDay;
        link.href = curDay;
        link.textContent = startDay;
        linkCont.appendChild(link);
        cont.appendChild(linkCont);
    }
}
function generateDays(cont, date){
    removeAllChildNodes(cont);
    addLabelsToGrid(cont);
    generateDaysofPreviousMonth(cont);
    for(let i=1; i<=numberOfDays; i++) {
        let linkCont = document.createElement('div');
        linkCont.classList.add("day");
        let link = document.createElement('a');
        link.classList.add("day--link");
        curDay = currentMonth + '-' + i;
        link.id = curDay;
        link.href = curDay;
        link.textContent = i;
        linkCont.appendChild(link);
        cont.appendChild(linkCont);
    }
    generateDaysofNextMonth(cont);
    let year = document.querySelector('#year');
    year.textContent = date.getFullYear();
    let month = document.querySelector('#month');
    month.textContent = monthNames[date.getMonth()];
}
generateDays(grid, today);
let next = document.querySelector('#next');
let prev = document.querySelector('#prev');

next.addEventListener('click', function(){
    today.setMonth(today.getMonth() < 11 ? today.getMonth() + 1 : 0);
    today.setFullYear(today.getMonth() > 0 ? today.getFullYear() : today.getFullYear() + 1)
    currentMonth = monthNames[today.getMonth()];
    numberOfDays = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDay();
    generateDays(grid, today);
})

prev.addEventListener('click', function(){
    today.setMonth(today.getMonth() > 0 ? today.getMonth() - 1 : 11);
    today.setFullYear(today.getMonth() < 11 ? today.getFullYear() : today.getFullYear() - 1)
    currentMonth = monthNames[today.getMonth()];
    numberOfDays = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDay();
    generateDays(grid, today);
})

function addLabelsToGrid(grid){
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const classNames = "day-label";

    days.forEach(day => {
        let label = document.createElement('div');
        let labelText = document.createElement('a');

        labelText.textContent = day;
        label.classList = classNames;
        label.appendChild(labelText);
        grid.appendChild(label);
    })
}