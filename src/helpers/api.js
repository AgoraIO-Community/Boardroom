const library = (function () {
    const axios = require('axios');

    const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://timercheck.io'
    const TIME_MS = 300

    function setTimer(timerName) {
        return axios.get(`${BASE_URL}/${timerName}/${TIME_MS}`) // 5 min
    }

    function getTimer(timerName)  {
        return axios.get(`${BASE_URL}/${timerName}`)
    }

    return {
        setTimer,
        getTimer
    }

})();
module.exports = library;

