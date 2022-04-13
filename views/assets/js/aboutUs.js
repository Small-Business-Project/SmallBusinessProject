function showPopUp(){
    const showPopUpButtons = document.querySelectorAll('.day--link');
    let btns = Array.from(showPopUpButtons);
    const popUpContainer = document.querySelector('.popUpContainer');
    const closePopUpButton = document.querySelector('.closePopUpContainer');

    btns.forEach(btn => {
        btn.addEventListener('click', function(){
            popUpContainer.classList.toggle('hide');
        })
    })
    closePopUpButton.addEventListener('click', function(){
        popUpContainer.classList.toggle('hide');
    });
};

showPopUp();