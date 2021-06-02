const axios = require("axios");

const BASE_URL = 'https://worldometers.p.rapidapi.com/api/coronavirus/all/'
const KEY = '4bd284edd3mshe6058bcf06fb075p128894jsne53351e0ed50'

module.exports = {
    getCovid: () => axios({
        method: "GET",
        url: BASE_URL,
        headers: {
            "x-rapidapi-key":"4bd284edd3mshe6058bcf06fb075p128894jsne53351e0ed50",
            "x-rapidapi-host": "worldometers.p.rapidapi.com",
            "useQueryString": true
        }
    })

}