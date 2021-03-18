(function(){
    for (i in [...Array(13).keys()]) {
        let id = '#mortgageIframe' + i;
        iFrameResize({ log: false }, id);
    }
})()