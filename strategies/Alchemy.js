/************************
 * Alchemy Strategy by Benjamin Schnabel
 * @type {{}}
 */

var log = require('../core/log.js');
var _ = require('lodash');
var async = require('async');

//buy fee
// Bitstamp = 0.25%
    const buyFee = 0.25;

    //withdraw fee
// Bitstamp = 0,90€
const withdrawFee = 0.90;
    // Poloniex  https://poloniex.com/fees/
    //Maker 0.15%
    //Taker 0.25%
const maker = 0.15;
const taker = 0.25;

const amountEUR = 250;
const amountBTC = 0.03;

var rsiSum = [];
var candleArray = [];

var currentOrderPrice = 0;


// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function(candle) {
    process.stdout.write('\033c');
    // your code!
    console.log('init');
    this.name = 'Alchemy';
    /*var settings = {
        short: 10,
        long: 21,
        signal: 9
    };*/

    console.log('Settings:', this.settings);

    this.requiredHistory = this.tradingAdvisor.historySize;

    // define the indicators we need
    this.addIndicator('rsi', 'RSI', this.settings);

    this.addTulipIndicator('ema10','ema' , {
        optInTimePeriod: 10
    });
    this.addTulipIndicator('ema21','ema' , {
        optInTimePeriod: 21
    });

    this.addTalibIndicator('macd10', 'macd', {
        optInFastPeriod: 8,
        optInSlowPeriod: 26,
        optInSignalPeriod: 2
    });
    this.addTulipIndicator('rsi10', 'rsi', {
        optInTimePeriod: 10
    })


        //console.log('Profit: ' + this.performanceReport.profit);
        //console.log('Market: ' + this.performanceReport.market);

        //currentOrderPrice = this.roundTrip.entry.price;

        //console.log('Current Price: ' + currentOrderPrice);



}

// What happens on every new candle?
strat.update = function(candle) {
    // your code!
    console.log('update');
}

// For debugging purposes.
strat.log = function() {
    // your code!
    console.log('log');
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
    // your code!
    //buy at warmup
    if(this.warmupCompleted == true) {
        this.advice(
            'long', {
                trigger: { // ignored when direction is not "long"
                    type: 'trailingStop',
                    trailPercentage: this.settings.stopLoss
                }
            }
        );
    }

    console.log('check', candle.start.format());
    const ema10 = this.tulipIndicators.ema10.result.result;
    const ema21 = this.tulipIndicators.ema21.result.result;
    console.log({ema10, ema21});
   /*if (ema10 > ema21) {
        this.advice({
            direction: 'long',
            trigger: {
                type: 'trailingStop',
                trailPercentage: 8
            }
        });
    }
    // macd
    const macd10 = this.talibIndicators.macd10.result;
    console.log("MACD", macd10);
    /*if (macd10 >= 0 ) {
        this.advice('short');
    } else {
        this.advice('long');
    }*/

    // rsi
    /*
    const rsi10 = this.tulipIndicators.rsi10.result.result;
    console.log('RSI', rsi10);
    if(parseFloat(rsi10) > 0 ) {rsiSum.push(parseFloat(rsi10));}

    if (rsi10 > this.settings.RSI.maxRSI) {
        this.advice('long')
    }
    if (rsi10 < this.settings.RSI.minRSI) {
        this.advice('short')
    }*/

    //simple buy and sell at stop loss

    //if close it bigger than current value of the
    //FIXME: find order price
    console.log('Balance:' + this.price);
    //log.debug(this.price);
    //throw('Error');
    /*
    if(candle.close >= ((this.price / 100 * this.settings.sellPercentage) + this.price))
    {
        this.advice('short');
    }
    */
}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
    // your code!
    // calculate max and min
    // console.log(rsiSum);
    console.log('Max RSI:', Math.max.apply(Math, rsiSum));
    console.log('Min RSI:', Math.min.apply(Math, rsiSum));
    console.log('Mean RSI:', rsiSum.reduce((a,b) => a +b, 0) / rsiSum.length);
}


function threebar(candleArray){

    // first option: long up, short down, long up
    if (candleArray[0] == true && candleArray[1] == false && candleArray[2] == true){
        // 3-bar upward trend found.
        this.advice('long');
    }

    //second option: long up, short down, short up, long up

    //third option: long down, short up, long down

    //fourth option: long down, short up, short up, long down

}

/*candle.prototype.trend = function() {

    // figure out if the trend is up or down.
    // returns true for upward, false for downward trend
    if (candle.close() > candle.open() ){
        //candle is high
        return true;
    } else {
    //candle is low
    return false;
    }
}

candle.prototype.distance = function(){

}

function addToCandleArray(candle, candleArray) {
    candleArray.push(candle);
    if (candleArray().count > 4) { // for 4 bar chart
        candleArray.shift();
    }
    return candleArray;
}
*/

module.exports = strat;