// Node js test environment
//
// ! add 
//      "type": "module", 
//in package.json

"use strict";

import { CheckSuitabilityCanton, GetWMSCanton, GetWMSLegendCanton, error } from './src/SuitabilityGeothermalDrillingSwitzerland.js';

//  await CheckSuitabilityCanton(2655805, 1258983, 'AG');
// await CheckSuitabilityCanton(2653716, 1269536, 'AG');
// await CheckSuitabilityCanton(2658947, 1240238, 'AG');

// await CheckSuitabilityCanton(2703052, 1180378, 'UR');
// await CheckSuitabilityCanton(2699152, 1175536, 'UR');
// await CheckSuitabilityCanton(2708687, 1186403, 'UR');

//  await CheckSuitabilityCanton(2747293, 1243755, 'AI');
// await CheckSuitabilityCanton(2751274, 1244545, 'AI');
// await CheckSuitabilityCanton(2748348, 1237931, 'AI');

// await CheckSuitabilityCanton(2622256, 1258565, 'BL');
// await CheckSuitabilityCanton(2623417,1270092, 'BL');
// await CheckSuitabilityCanton(2623369, 1261302, 'BL');
// await CheckSuitabilityCanton(2623503,1259120, 'BL');
// await CheckSuitabilityCanton(2620984,1259551, 'BL');
// await CheckSuitabilityCanton(2620314.1,1263004.5, 'BL');

// await CheckSuitabilityCanton(2724237, 1206147, 'GL');
// await CheckSuitabilityCanton(2725831, 1215961, 'GL');

// await CheckSuitabilityCanton(2679004, 1247702, 'ZH');
// await CheckSuitabilityCanton(2684200, 1244025, 'ZH');
let response = await CheckSuitabilityCanton(2689003, 1274084, 'ZH');
if (response === 999)
    console.log(error);

// await CheckSuitabilityCanton(2599516, 1200212, 'BE');
// await CheckSuitabilityCanton(2599525, 1201544, 'BE');
// await CheckSuitabilityCanton(2600318, 1199065, 'BE');
// await CheckSuitabilityCanton(2597320, 1198900, 'BE');
// await CheckSuitabilityCanton(2621040, 1171911, 'BE');

// await CheckSuitabilityCanton(2745188, 1187042, 'GR');
// await CheckSuitabilityCanton(2747613, 1190056, 'GR');
// await CheckSuitabilityCanton(2730752, 1191438, 'GR');
// await CheckSuitabilityCanton(2748859, 1196990, 'GR');

// await CheckSuitabilityCanton(2695476, 1286474, 'SH');
// await CheckSuitabilityCanton(2695085, 1290396, 'SH');
// await CheckSuitabilityCanton(2691554, 1293373, 'SH');
// await CheckSuitabilityCanton(2682889, 1292346, 'SH');
// await CheckSuitabilityCanton(2690343, 1289821, 'SH');

// await CheckSuitabilityCanton(2704293, 1214985, 'SZ');

// await CheckSuitabilityCanton(2747716.6, 1262056.4, 'TG');
// await CheckSuitabilityCanton(2747720.5, 1262436.9, 'TG');
// await CheckSuitabilityCanton(2747719.4, 1262269.7, 'TG');
// await CheckSuitabilityCanton(2740704.4, 1260672.8, 'TG');
// await CheckSuitabilityCanton(2741036.0, 1260729.5, 'TG');

// await CheckSuitabilityCanton(2536682, 1156974, 'VD');
// await CheckSuitabilityCanton(2548704, 1168639, 'VD');
// await CheckSuitabilityCanton(2535551, 1180721, 'VD');

// await CheckSuitabilityCanton(2676912, 1228091, 'ZG');
// await CheckSuitabilityCanton(2684565, 1225437, 'ZG');
// await CheckSuitabilityCanton(2686680, 1226360, 'ZG');

// await CheckSuitabilityCanton(2599214,1120261, 'VS');      //4/0
// await CheckSuitabilityCanton(2599307,1125129, 'VS');      //3/100
// await CheckSuitabilityCanton(2599331,1123423, 'VS');      //1/400
// await CheckSuitabilityCanton(2599032,1125930, 'VS');      //2/-999
// await CheckSuitabilityCanton(2598068.4,1130927.1, 'VS');      //5/-999
// await CheckSuitabilityCanton(2609841,1125573, 'VS');      //3/200
// await CheckSuitabilityCanton(2609846,1125808, 'VS');      //3/50

// await CheckSuitabilityCanton(2510785, 1121097, 'GE', true);   //Sondes géothermiques verticales (système fermé)
// await CheckSuitabilityCanton(2506500,1118148, 'GE');      //Demande de renseignement
// await CheckSuitabilityCanton(2502640,1113946, 'GE');      //Interdiction de géothermie
// await CheckSuitabilityCanton(2494984,1116373, 'GE');      //Géothermie sur nappe (système ouvert)
// await CheckSuitabilityCanton(2502359,1110025, 'GE');      //ausserhalb


// await GetWMSCanton('VS');
// let wms = await GetWMSCanton('TG');
// console.log(wms);

// let legends = await GetWMSLegendCanton('VD');
// console.log(legends);












