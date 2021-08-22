document.querySelector('#search').addEventListener('click', () => {
    $('.vendor-detail-wrapper').fadeIn(350);
    $('.results-wrapper').fadeIn(350);
    $(".profile-div").fadeOut(0);
})

document.querySelector('#profile-button').addEventListener('click', () => {
    $('.vendor-detail-wrapper').fadeOut(0);
    $('.results-wrapper').fadeOut(0);
    $(".profile-div").fadeIn(350);
})