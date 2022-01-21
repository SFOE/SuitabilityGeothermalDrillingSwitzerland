// Node js test environment
//
// ! add 
//      "type": "module", 
//in package.json

"use strict";

import { CheckSuitabilityCanton, GetWMSCanton, GetWMSLegendCanton, error, proxyServer, SetProxyServer, TestAllCantons } from './src/SuitabilityGeothermalDrillingSwitzerland.js';

import fs from 'fs'; 
import fetch from 'cross-fetch';  
SetProxyServer('https://bfe-cors.geotest.ch/');
let result = await TestAllCantons();
console.log(result);

console.log("Writing result to markdown");

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

let everythingWorking = true;
let problemsWithCantons = "";
// Ouput Result to cantons_test.md

var file = fs.createWriteStream('./cantons_test.md');
file.on('error', function(err) { /* error handling */ });
file.write("# Cantons Test Output\nRun on "+year+"/"+month+"/"+ date + " " + hours+ ":" + minutes + ":" + seconds+"\n## Results\n\n|Canton|Result expected|Configured|WMS|GetCapabilities|GetFeature|\n|----------------|-------------------------------|-----------------------------|-----------------------------|-----------------------------|-----------------------------|\n")
result.forEach(function(v) { 
    let outputline = "";
    let header = "|" + v.canton;

    v.wmsAlive.forEach(function(alive) {
        if (alive.expectedResult==true) {
            outputline = header + "|<span style='color:green;'>"+  alive.expectedResult +"</span>|" + v.configured + "|" +  alive.wms + "|" + alive.aliveGetCap + "|" + alive.aliveGetFeat + "|";
        }
        else if (v.configured==false) {
            outputline += header + "|<span style='color:grey;'>"+  alive.expectedResult +"</span>|" + v.configured + "||||";
        }
        else if (alive.expectedResult=="undefinde")
        {
            outputline += header + "|<span style='color:grey;'>"+  alive.expectedResult +"</span>|" + v.configured + "|" + alive.wms + "|" + alive.aliveGetCap + "|" + alive.aliveGetFeat + "|";
        }
        else {
            everythingWorking = false;
            problemsWithCantons += v.canton +", ";
            outputline += header + "|<span style='color:red;'>"+  alive.expectedResult +"</span>|" + v.configured + "|" + alive.wms + "|" + alive.aliveGetCap + "|" + alive.aliveGetFeat + "|";
        }

        file.write(outputline);
        file.write("\n");
    })
});

file.write("\n\n## Overall results\n\n");
if (everythingWorking) {
    file.write("<span style='color:green;font-weight:bold;'>All services up and running</span>");
    // send heartbeat to uptime
    await fetch('https://heartbeat.uptimerobot.com/m790238162-94cef700d39c5a92f275efbdeaca8710143a392b');
}
else file.write("<span style='color:red;font-weight:bold;'>Problems with following canton(s): " + problemsWithCantons.substring(0, problemsWithCantons.length - 2) + "</span>");
file.end();







