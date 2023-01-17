//  SuitabilityGeothermalDrillingSwitzerland
//
/**
 * @module SuitabilityGeothermalDrillingSwitzerland
 * @typicalname BfeLib 
*/
'use strict';

import fetch from 'cross-fetch';    //node js only
import jsdom from "jsdom";          //node js only
import fs from 'fs';                //node js only

import _ from 'underscore';
import ImageWMS from 'ol/source/ImageWMS.js';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';

proj4.defs(
    "EPSG:2056",
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
);
register(proj4);

/**
 * on (catched) error, this object contains the error
 */
export let error;

/**
 * Proxy server URL (Getter)
 */
export let proxyServer = 'https://bfe-cors.geotest.ch/';

/**
 * Setter for proxyServer
 * @param {string} url proxy server url, e.g. 'https://bfe-cors.geotest.ch/'
 * @example SetProxyServer('https://bfe-cors.geotest.ch/');
 */
export function SetProxyServer(url) {
    if (url)
        proxyServer = url;
}

/**
 * async_fetch
 * @ignore
 * @param {string} url 
 * @returns {string} json
 */
async function async_fetch(url) {
    let response = await fetch(url)
    if (response.ok)
        return await response.json()
    throw new Error(response.status)
}

/**
 * getAllCantonsJson
 * @ignore
 * @returns {object} all canton definitions from json
 */
async function getAllCantonsJson() {
    let cantonsJson;

    if (typeof window === 'undefined') {        //node js env
        const JSDOM = jsdom.JSDOM;
        global.DOMParser = new JSDOM('<!doctype html><html><body></body></html>').window.DOMParser;
        global.Node = new JSDOM('').window.Node;

        let rawCantons = fs.readFileSync('cantons.json');
        cantonsJson = JSON.parse(rawCantons);
    }
    else {                                      // browser env
        cantonsJson = await async_fetch('cantons.json');
    }
    return cantonsJson;
}

/**
 * getCantonJson
 * @ignore
 * @param {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @returns {object} canton definition from json
 */
async function getCantonJson(cantonAbbrev) {
    //get cantons
    const cantonsJson = await getAllCantonsJson();
    let cantons_array = cantonsJson.cantonsList;

    //get canton by abbreviation
    let canton = _.find(cantons_array, i => i.name === cantonAbbrev);

    return canton;
}
/**
 * getWMSList
 * @ignore
 * @param {object} canton canton defintion from json
 * @returns {object[]} list with wms defintions
 */
async function getWMSList(canton) {
    let wmsList = [];

    if (canton != undefined) {
        const hasMultiWMS = typeof canton.wmsMulti !== 'undefined';
        if (hasMultiWMS) {  //handle mutliple wms sources
            // console.log('Multiple WMS defined: ', canton.wmsMulti);

            for (let index = 0; index < canton.wmsMulti.length; index++) {
                const wmsItem = canton.wmsMulti[index];
                wmsList.push(wmsItem);
            }
        }
        else {              //handle single wms source
            wmsList.push({
                wmsUrl: canton.wmsUrl,
                mapServerUrlLegendUrl: canton.mapServerUrlLegendUrl,
                infoFormat: canton.infoFormat,
                layers: canton.layers
            });
        }
    }
    return wmsList;
}

/**
 * imageWMSFactory
 * @ignore
 * @param {object} wmsItem url and layer definition
 * @param {boolean} withProxy add proxy server to url. default = false
 * @param {string} wmsVersion (optional) default='1.3.0'
 * @param {boolean} noLayers (optional) ommit layers list. default = false
 * @returns {ImageWMS} ol imageWMS object
 */
async function imageWMSFactory(wmsItem, withProxy = false, wmsVersion = '1.3.0', noLayers = false) {
    let layerNames = _.pluck(wmsItem.layers, 'name');   //get wms layer names

    let url = wmsItem.wmsUrl;
    if (withProxy) url = proxyServer + wmsItem.wmsUrl;

    if (noLayers) {
        const imageWms = new ImageWMS({
            url: url,
            params: {
                'VERSION': wmsVersion,
                'TRANSPARENT': false
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous',
        });

        return imageWms;
    }
    else {
        const imageWms = new ImageWMS({
            url: url,
            params: {
                'LAYERS': [...layerNames],
                'VERSION': wmsVersion,
                'TRANSPARENT': false
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous',
        });

        return imageWms;
    }
}

/**
 * esriRestFeatureFactory
 * @ignore
 * @param {string} featureServerUrl base url for esri REST feature server
 * @param {number} easting LV95 Easting
 * @param {number} northing LV95 Northing
 * @returns {string} feature server url at position E/N
 */
async function esriRestFeatureFactory(featureServerUrl, easting, northing) {
    const delta = 0.01;     //variation for bbox
    let url = featureServerUrl +
        '/query/?f=json&' +
        'imageDisplay=1,1,1&' +
        'tolerance=1&' +
        // 'returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometry=' +
        'geometry={%22x%22%3A' +
        `${(easting).toFixed(3)}` +
        '%2C%22y%22%3A' +
        `${(northing).toFixed(3)}` +
        '}&' +
        'returnGeometry=false&' +
        // 'spatialRel=esriSpatialRelIntersects&' +
        'mapExtent=' +
        `${(easting - delta).toFixed(3)}` +
        ',' +
        `${(northing - delta).toFixed(3)}` +
        ',' +
        `${(easting + delta).toFixed(3)}` +
        ',' +
        `${(northing + delta).toFixed(3)}` +
        // '&geometryType=esriGeometryEnvelope&' +
        '&geometryType=esriGeometryPoint&' +
        'inSR=2056&' +
        '&outSR=2056' +
        '&sr=2056';

    return url;
}

/**
 * GetWMSCanton
 * @async
 * @param  {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @param {boolean} withProxy (optional) add proxy server to url. default = false
 * @param {boolean} verbose (optional) activate console log. default = false
 * @return {ImageWMS[]} for open layers wms, not defined for esri yet
 * @example const imageWmsList = await GetWMSCanton('UR', true);
 */
export async function GetWMSCanton(cantonAbbrev, withProxy = false, verbose = false) {
    const canton = await getCantonJson(cantonAbbrev);
    const wmsList = await getWMSList(canton);

    let imageWmsList = [];
    //multiple wms possible
    for (const wmsItem of wmsList) {
        if (wmsItem.infoFormat !== 'arcgis/json') {     //openlayers WMS

            let imageWms, wmsVersion;
            if (canton.wmsVersion)                          //needed for TI so far
            {
                wmsVersion = canton.wmsVersion;
                imageWms = await imageWMSFactory(wmsItem, withProxy, wmsVersion);
            }
            else {
                imageWms = await imageWMSFactory(wmsItem, withProxy);
            }

            imageWmsList.push(imageWms);
        }
        else {                                          //Esri ArcGIS REST 

            if (canton.mapServerUrl && canton.wmsUrlEsriLayer) {  //if esri wmsserver defined
                let esriItem = {
                    wmsUrl: canton.mapServerUrl,
                    mapServerUrlLegendUrl: undefined,
                    infoFormat: canton.infoFormat,
                    layers: [{ name: canton.wmsUrlEsriLayer }]
                };
                const imageWms = await imageWMSFactory(esriItem, withProxy);
                imageWmsList.push(imageWms);
            }
            else {
                if (verbose) console.log('Esri ArcGIS REST not implemented yet for canton ', cantonAbbrev);
            }
        }
    }

    return imageWmsList;
}

/**
 * GetWMSLegendCanton
 * @async
 * @param  {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @return {string[]} legend urls
 * @example let legends = await GetWMSLegendCanton('VD');
 */
export async function GetWMSLegendCanton(cantonAbbrev) {

    //TODO: impolement for ESRI case?

    const imageWmsList = await GetWMSCanton(cantonAbbrev);

    let legendUrlList = [];
    for (const imageWmsItem of imageWmsList) {
        const legendItem = imageWmsItem.getLegendUrl();
        if (legendItem != null) legendUrlList.push(legendItem);
    }

    if (legendUrlList.length == 0) {
        const canton = await getCantonJson(cantonAbbrev);
        const wmsList = await getWMSList(canton);
        for (const wmsInfo of wmsList) {
            if (wmsInfo.mapServerUrlLegendUrl != null) legendUrlList.push(wmsInfo.mapServerUrlLegendUrl);
        }
    }

    return legendUrlList;
}

/**
 * CheckSuitabilityCanton
 * @async
 * @param {number} easting LV95 Easting in (m)
 * @param {number} northing  LV95 Northing in (m)
 * @param {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @param {boolean} verbose (optional) activate console log
 * @returns {number} harmonised suitability value, 999 on error -> check 'error' object
 * - 1 = Kat 1: Grundsätzlich mit allgemeinen Auflagen zulässig
 * - 2 = Kat 2: Grundsätzlich mit speziellen Auflagen zulässig
 * - 3 = Kat 3: Grundsätzlich nicht zulässig
 * - 4 = Kat 4: Aussage zur Eignung zurzeit nicht möglich
 * - 5 = Kat 5: Keine Daten vorhanden
 * @example let result = await CheckSuitabilityCanton(2652462, 1196901, 'LU');
 */
export async function CheckSuitabilityCanton(easting, northing, cantonAbbrev, verbose = true) {
    try {

        error = undefined;  //reset error object

        //Check perimeter
        const lowerleft = [2480000, 1070000];
        const upperright = [2840000, 1300000];
        if (easting < lowerleft[0] || easting > upperright[0] ||
            northing < lowerleft[1] || northing > upperright[1]) {
            error = new Error('Not in the ESPG 2056 perimeter: ' + lowerleft + '  ' + upperright);
            return 999;
        }

        const style = 'color:red; font-size:20px; font-weight: bold; -webkit-text-stroke: 1px black;'
        if (verbose) console.log("%c CheckSuitabilityCanton ", style);

        // //get canton by abbreviation
        const canton = await getCantonJson(cantonAbbrev);
        if (!canton) {
            if (verbose) console.log('canton abbreviation not supported: ' + cantonAbbrev);
            return 5;        //kategorie weiss=5
        }

        // single vs multiple wms sources
        const wmsList = await getWMSList(canton);

        let mappingSum = 0;                 //the value to map in the harmony map
        for (const wmsItem of wmsList) {

            let url;
            if (wmsItem.infoFormat !== 'arcgis/json') {         //openlayers WMS

                let imageWms;

                // wmsVersion in use for TI so far
                // loopLayers in use for LU so far
                imageWms = await imageWMSFactory(wmsItem, false, canton.wmsVersion, canton.loopLayers);

                url = imageWms.getFeatureInfoUrl(
                    [easting, northing],
                    0.2,                // small bbox extent is crucial, especially for wms with zoom factors
                    'EPSG:2056',        // EPSG:2056 = LV95
                    {
                        'INFO_FORMAT': wmsItem.infoFormat
                    }
                );
            }
            else {                      //Esri ArcGIS REST 
                url = await esriRestFeatureFactory(wmsItem.wmsUrl, easting, northing);
            }

            if (verbose) console.log(url);

            if (url) {
                try {
                    //fetch wms url
                    url = proxyServer + url;
                    if (verbose && wmsItem.infoFormat !== 'arcgis/json') console.log(url);

                    let response = await fetch(url);        //Remark: not needed for wmsItem.infoFormat === 'arcgis/json'
                    // if (response.status !== 200) {
                    //     throw 'response status = ' + response.status;
                    // }

                    let dataraw = await response.text();

                    if (verbose && wmsItem.infoFormat !== 'arcgis/json' && canton.loopLayers == false)
                        console.log(dataraw);

                    //handle response
                    for (let layer of wmsItem.layers) {
                        if (verbose) console.log('\nlayer name: \t', layer.name);

                        let value;

                        //handle different text formats
                        if (wmsItem.infoFormat === 'application/vnd.ogc.gml') {
                            const featureInfo = new WMSGetFeatureInfo({ layers: layer.name });
                            const feature = featureInfo.readFeatures(dataraw);
                            value = _.first(_.pluck(_.pluck(feature, 'values_'), layer.propertyName));
                        }
                        else if (wmsItem.infoFormat === 'application/geojson' ||
                            wmsItem.infoFormat === 'application/geo+json' ||
                            wmsItem.infoFormat === 'application/json' ||
                            wmsItem.infoFormat === 'arcgis/json') {

                            let rootName = 'features';
                            let nodeName = 'properties';
                            if (layer.rootName) {
                                rootName = layer.rootName;
                            }
                            if (layer.nodeName) {
                                nodeName = layer.nodeName;
                            }

                            // if (wmsItem.infoFormat !== 'arcgis/json') {
                            //     //continue with former request data
                            // }
                            if (wmsItem.infoFormat == 'arcgis/json' || canton.loopLayers == true) {

                                let urlLayer = url + '&layers=' + layer.name;
                                urlLayer = urlLayer + '&QUERY_LAYERS=' + layer.name;

                                if (verbose) console.log(urlLayer);
                                response = await fetch(urlLayer);       // get esri rest response for layer
                                dataraw = await response.text();
                                if (verbose) console.log(dataraw);

                            }
                            if (verbose) console.log('node name: \t', nodeName);

                            let data = JSON.parse(dataraw)
                            if (_.has(data, rootName) && data[rootName].length > 0) {

                                if (layer.priorityMax && data[rootName].length > 1) {
                                    //sort by 'priorityMax' descending
                                    data[rootName] = _.sortBy(data[rootName], function (o) { return -o.attributes[layer.priorityMax]; });
                                }

                                //take the first elmement
                                value = data[rootName][0][nodeName][layer.propertyName];

                                // Is value not defined and do we have more features?
                                if (!value && data[rootName].length > 1) {
                                    data[rootName].every(v => {
                                        value = v[nodeName][layer.propertyName];
                                        if (!value) return true;
                                        return false;
                                    });
                                }
                            }
                            else {
                                value = undefined;
                            }
                        }
                        else {
                            error = new Error('infoFormat not implemented: ' + wmsItem.infoFormat);
                            return 999;
                        }

                        if (verbose) console.log('property name: \t', layer.propertyName);

                        //assign summand
                        if (_.has(layer, 'propertyValues')) {   //evaluate multiple return values
                            if (value === undefined) {
                                value = 'undefined';
                            }

                            let propertyValueNameByContains = _.some(layer.propertyValues, i => i.contains);
                            let propertyValueNames = _.pluck(layer.propertyValues, 'name');

                            if (!propertyValueNameByContains) {  //search for exact match
                                if (_.contains(propertyValueNames, value)) {

                                    let propertyValue = _.find(layer.propertyValues, i => i.name === value);
                                    if (verbose) console.log('\t list match exact: \t', propertyValue.name);
                                    if (verbose) console.log('\t summand:          \t', propertyValue.summand);
                                    mappingSum += propertyValue.summand;
                                }
                                else {
                                    if (verbose) console.log('\t NO match: \t', value);
                                }
                            }
                            else {                              //search for contains text
                                if (_.filter(propertyValueNames,
                                    function (text) {
                                        return value.includes(text);
                                    })) {
                                    let propertyValue = _.find(layer.propertyValues, i => value.includes(i.name));
                                    if (verbose) console.log('\t list match contains: \t', propertyValue.name);
                                    if (verbose) console.log('\t summand:             \t', propertyValue.summand);
                                    mappingSum += propertyValue.summand;
                                }
                                else {
                                    if (verbose) console.log('\t NO match: \t', value);
                                }
                            }
                        }
                        else {      //evaluate presence of property value
                            if (value) {
                                if (verbose) console.log('\t presence match: \t', value);
                                if (verbose) console.log('\t summand:        \t', layer.summand);
                                mappingSum += layer.summand;
                            }
                            // else {
                            //     console.log('\t NO match.');
                            // }

                        }
                    }
                    if (verbose) console.log('\n---------------------------------------------');
                }
                catch (err) {
                    error = err;
                    return 999;
                }
            }
        }

        // Harmonisation: mappping the response
        if (canton.harmonyMap) {
            let mappingItem = _.find(canton.harmonyMap, i => i.sum === mappingSum);
            let mappingValue;
            if (!mappingItem) {
                if (mappingSum === 0)
                    mappingValue = 4;               //Fallback
                else {
                    mappingValue = undefined;
                    error = new Error('no harmonised value found for sum = ' + mappingSum);
                    return 999;
                }
            }
            else {
                mappingValue = mappingItem.value;
            }
            if (verbose) console.log('Mapping Sum:     \t', mappingSum);
            if (verbose) console.log('Harmonised value:\t', mappingValue);
            return mappingValue;
        }
        else {
            if (verbose) console.log('Mapping Sum:     \t', mappingSum);
            if (verbose) console.log('Harmonised value:\t', 'no harmony map found');
            error = new Error('no harmony found for canton ' + canton.name);
            return 999;
        }

    } catch (err) { //global catch
        error = err;
        return 999;
    }
}

/**
 * Check url for status ok
 * @ignore
 * @param {string} url 
 * @returns {boolean} status=ok
 */
async function checkLinkOk(url) {
    if (url)
        return (await fetch(url)).ok;
    else
        return false;
}

/**
 * Test WMS definition for all cantons
 * @async
 * @param {boolean} verbose (optional) activate detailled console log. default = true
 * @returns {object} test result for all cantons
 * @example let result = await TestAllCantons();
 */
export async function TestAllCantons(verbose = true) {

    let cantonsDict = [];

    const cantons = await getAllCantonsJson();
    const cantonsList = cantons.cantonsList;
    const cantonNames = _.pluck(cantonsList, 'name').sort();

    // First test proxy
    try {
        let isOnline = await checkLinkOk(proxyServer + 'https://admin.ch');
        if (!isOnline) console.log("Proxy or Admin not working...");
    }
    catch (e) {
        console.log("Proxy or Admin not working...");
    }

    // let cantonAbbrevList = ['LU'];

    for (const cantonAbbrev of cantonAbbrevList) {

        const configured = _.contains(cantonNames, cantonAbbrev);
        let wmsAlive = [];

        if (configured) {
            let imageWmsList;

            imageWmsList = await GetWMSCanton(cantonAbbrev, true);

            if (imageWmsList.length == 0) {   //esri rest return empty list --> fallback: assume esri rest
                let canton = _.find(cantonsList, i => i.name === cantonAbbrev);
                let location1 = canton.exampleLocation[0];

                let wmsGetFeatureInfoOk = false;
                let suitability = await CheckSuitabilityCanton(location1[0], location1[1], cantonAbbrev, verbose);

                if (suitability && suitability < 5 && suitability > 0)
                    wmsGetFeatureInfoOk = true;
                let checkResult = suitability === location1[2];

                let wmsAlive = [];
                wmsAlive.push({
                    wms: 'none',
                    aliveGetCap: undefined,
                    aliveGetFeat: wmsGetFeatureInfoOk,
                    expectedResult: checkResult
                });

                let item = {
                    canton: cantonAbbrev,
                    configured: configured,
                    wmsAlive: wmsAlive
                }

                cantonsDict.push(item);
                console.log(cantonAbbrev);
                continue;
            }

            for (const imageWmsItem of imageWmsList) {
                try {
                    const wmsUrl = imageWmsItem.getUrl();

                    // Check GetCapabilities
                    let wmsVersion = imageWmsItem.params_.VERSION;
                    const wmsGetCapabilitiesUrl = wmsUrl + '?version=' + wmsVersion + '&request=GetCapabilities&service=WMS';
                    const wmsGetCapabilitiesOk = await checkLinkOk(wmsGetCapabilitiesUrl);

                    let wmsGetFeatureInfoOk = false;
                    let canton = _.find(cantonsList, i => i.name === cantonAbbrev);
                    let location1 = canton.exampleLocation[0];

                    // Check Suitability (GetFeatureInfo)
                    let suitability = await CheckSuitabilityCanton(location1[0], location1[1], cantonAbbrev, verbose);
                    if (suitability && suitability < 5 && suitability > 0)
                        wmsGetFeatureInfoOk = true;

                    // let checkResult = suitability === Number(location1[2]);
                    let checkResult = suitability === location1[2];

                    wmsAlive.push({
                        wms: wmsUrl,
                        aliveGetCap: wmsGetCapabilitiesOk,
                        aliveGetFeat: wmsGetFeatureInfoOk,
                        expectedResult: checkResult //not fully implemented yet
                    });

                }
                catch (err) {
                    wmsAlive.push({
                        wms: imageWmsItem.url,
                        alive: false,
                        error: err
                    });
                }
            }
            if (imageWmsList.length === 0)  //no wms for canton found
                wmsAlive.push({
                    wms: 'none',
                    aliveGetCap: undefined,
                    aliveGetFeat: undefined,
                    expectedResult: undefined
                });

        }
        else {  //canton not configured
            wmsAlive.push({
                wms: 'none',
                aliveGetCap: undefined,
                aliveGetFeat: undefined,
                expectedResult: undefined
            });
        }

        let item = {
            canton: cantonAbbrev,
            configured: configured,
            wmsAlive: wmsAlive
        }

        cantonsDict.push(item);
        console.log(cantonAbbrev);
    }

    return cantonsDict;
}

/**
 * All 26 canton abbreviations
 * @ignore
 */
const cantonAbbrevList = ['AG',
    'AI',
    'AR',
    'BE',
    'BL',
    'BS',
    'FR',
    'GE',
    'GL',
    'GR',
    'JU',
    'LU',
    'NE',
    'NW',
    'OW',
    'SG',
    'SH',
    'SO',
    'SZ',
    'TG',
    'TI',
    'UR',
    'VD',
    'VS',
    'ZG',
    'ZH'];

export default { GetWMSCanton, GetWMSLegendCanton, CheckSuitabilityCanton, error, proxyServer, SetProxyServer, TestAllCantons };