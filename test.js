// Node js test environment
//
// ! add 
//      "type": "module", 
//in package.json

"use strict";

import {CheckSuitabilityCanton, GetWMSCanton, GetWMSLegendCanton} from './src/bfe_lib.js';

// await CheckSuitabilityCanton(2655805, 1258983, 'AG');

// await CheckSuitabilityCanton(2684890, 1182492, 'UR');
// await CheckSuitabilityCanton(2747293, 1243755, 'AI');
// await CheckSuitabilityCanton(2622256, 1258565, 'BL');
// await CheckSuitabilityCanton(2724237, 1206147, 'GL');
// await CheckSuitabilityCanton(2679004, 1247702, 'ZH');
// await CheckSuitabilityCanton(2599516, 1200212, 'BE');
// await CheckSuitabilityCanton(2745188, 1187042, 'GR');
// await CheckSuitabilityCanton(2695476, 1286474, 'SH');
// await CheckSuitabilityCanton(  2749446,    1264517, 'TG');
// await CheckSuitabilityCanton(2536682, 1156974, 'VD');
//  await CheckSuitabilityCanton(2690680, 1219207, 'ZG');

// await CheckSuitabilityCanton(2599214,1120261, 'VS');      //4/0
// await CheckSuitabilityCanton(2599307,1125129, 'VS');      //3/100
// await CheckSuitabilityCanton(2599331,1123423, 'VS');      //1/400
// await CheckSuitabilityCanton(2599032,1125930, 'VS');      //2/-999
// await CheckSuitabilityCanton(2598068.4,1130927.1, 'VS');      //5/-999
// await CheckSuitabilityCanton(2609841,1125573, 'VS');      //3/200
// await CheckSuitabilityCanton(2609846,1125808, 'VS');      //3/50

//await CheckSuitabilityCanton(2510785,1121097, 'GE');   //Sondes géothermiques verticales (système fermé)
// await CheckSuitabilityCanton(2506500,1118148, 'GE');      //Demande de renseignement
// await CheckSuitabilityCanton(2502640,1113946, 'GE');      //Interdiction de géothermie
// await CheckSuitabilityCanton(2494984,1116373, 'GE');      //Géothermie sur nappe (système ouvert)
// await CheckSuitabilityCanton(2502359,1110025, 'GE');      //ausserhalb


// await GetWMSCanton('VS');
let wms = await GetWMSCanton('TG');
console.log(wms);

let legends = await GetWMSLegendCanton('TG');
console.log(legends);












