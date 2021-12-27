// Node js test environment
//
// ! add 
//      "type": "module", 
//in package.json

"use strict";

import { CheckSuitabilityCanton, GetWMSCanton, GetWMSLegendCanton, error, proxyServer, SetProxyServer, TestAllCantons } from './src/SuitabilityGeothermalDrillingSwitzerland.js';

import fs from 'fs'; 

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

// Ouput Result to cantons_test.md

var file = fs.createWriteStream('./cantons_test.md');
file.on('error', function(err) { /* error handling */ });
file.write("# Cantons Test Output\nRun on "+year+"/"+month+"/"+ date + "\n## Results\n\n|Canton|Result expected|Configured|WMS|GetCapabilities|GetFeature|\n|----------------|-------------------------------|-----------------------------|-----------------------------|-----------------------------|-----------------------------|\n")
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
            outputline += header + "|<span style='color:red;'>"+  alive.expectedResult +"</span>|" + v.configured + "|" + alive.wms + "|" + alive.aliveGetCap + "|" + alive.aliveGetFeat + "|";
        }

        file.write(outputline);
        file.write("\n");
    })
});
file.end();







