require('mongoose');
const Request = require('request');
const createError = require('http-errors');

module.exports = {
    overview: function (req, res, next) {
        try {
            Request.get("https://api.covid19api.com/summary", (err, resp, body) => {
                if (err) throw err;
                let data = JSON.parse(body);
                if (!data)
                    return next(createError(426, messages.NOT_FOUND));
                let result = {
                    'Total Deaths': data.Global.TotalDeaths,
                    'Total Cases': data.Global.TotalConfirmed,
                    'Total Active Cases': data.Global.TotalConfirmed - data.Global.TotalRecovered
                }
                res.responseHandler(result);
            })
        } catch (err) {
            return next(err);
        }
    },

    summary: function (req, res, next) {
        try {
            Request.get("https://api.covid19api.com/summary", (err, resp, body) => {
                if (err) throw err;
                let data = JSON.parse(body);
                if (!data)
                    return next(createError(426, messages.NOT_FOUND));
                let result = [];
                data.Countries.map(ele => {
                    result.push({
                        'Country': ele.Country,
                        'Total Deaths': ele.TotalDeaths,
                        'Total Cases': ele.TotalConfirmed,
                        'Total Active Cases': ele.TotalConfirmed - ele.TotalRecovered,
                        'Total Recovered': ele.TotalRecovered
                    })
                });

                res.responseHandler(result);
            })
        } catch (err) {
            return next(err);
        }
    }
};