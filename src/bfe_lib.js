//
//  SuitabilityGeothermalDrillingSwitzerland
//
//  TODO:   - license?
//          - add verbose/console.log switch
//          - uniform error handling 
//

'use strict';

// import fetch from "node-fetch"; //node js only, disable for browser compilation <<<<<<<<<<<<<<<<<<<<<<<<<<
// import jsdom from "jsdom";      //node js only, disable for browser compilation <<<<<<<<<<<<<<<<<<<<<<<<<<
// import fs from 'fs';            //node js only, disable for browser compilation <<<<<<<<<<<<<<<<<<<<<<<<<<

import _, { constant } from 'underscore';
import ImageWMS from 'ol/source/ImageWMS.js';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';

proj4.defs(
    "EPSG:2056",
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
);
register(proj4);

const proxyServer = 'https://bfe-cors-anywhere.herokuapp.com/';
//const proxyServer = 'http://www.whateverorigin.org/get?url=';

/**
 * async_fetch
 * @param {string} url 
 * @returns {string} json
 */
export async function async_fetch(url) {
    let response = await fetch(url)
    if (response.ok)
        return await response.json()
    throw new Error(response.status)
}

/**
 * getAllCantonsJson
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
 * @param {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @returns {object} canton definition from json
 */
async function getCantonJson(cantonAbbrev) {
    //get cantons
    const cantonsJson = await getAllCantonsJson();
    let cantons_array = cantonsJson.cantonsList;
    console.log(cantons_array);

    //get canton by abbreviation
    let canton = _.find(cantons_array, i => i.name === cantonAbbrev);
    console.log(canton);

    return canton;
}
/**
 * getWMSList
 * @param {object} canton canton defintion from json
 * @returns {object[]} list with wms defintions
 */
async function getWMSList(canton) {
    let wmsList = [];

    const hasMultiWMS = typeof canton.wmsMulti !== 'undefined';
    if (hasMultiWMS) {  //handle mutliple wms sources
        console.log('Multiple WMS defined: ', canton.wmsMulti);

        for (let index = 0; index < canton.wmsMulti.length; index++) {
            const wmsItem = canton.wmsMulti[index];
            wmsList.push(wmsItem);
        }
    }
    else {              //handle single wms source
        wmsList.push({
            wmsUrl: canton.wmsUrl,
            infoFormat: canton.infoFormat,
            layers: canton.layers
        });
    }

    return wmsList;
}

/**
 * imageWMSFactory
 * @param {object} wmsItem url and layer definition
 * @param {string} wmsVersion (optional) default='1.3.0'
 * @returns {ImageWMS} ol imageWMS object
 */
async function imageWMSFactory(wmsItem, wmsVersion = '1.3.0') {
    let layerNames = _.pluck(wmsItem.layers, 'name');   //get wms layer names

    const imageWms = new ImageWMS({
        url: wmsItem.wmsUrl,
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

/**
 * esriRestFeatureFactory
 * @param {string} featureServerUrl base url for esri REST feature server
 * @param {number} easting LV95 Easting
 * @param {number} northing LV95 Northing
 * @returns {string} feature server url at position E/N
 */
async function esriRestFeatureFactory(featureServerUrl, easting, northing) {
    const delta = 0.01;     //variation for bbox
    const url = featureServerUrl +
        '/query/?f=json&' +
        'returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometry=' +
        `${(easting - delta).toFixed(3)}` +
        ',' +
        `${(northing - delta).toFixed(3)}` +
        ',' +
        `${(easting + delta).toFixed(3)}` +
        ',' +
        `${(northing + delta).toFixed(3)}` +
        '&geometryType=esriGeometryEnvelope&' +
        'inSR=2056&' +
        '&outSR=2056';

    return url;
}

/**
 * GetWMSCanton
 * @param  {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @return {ImageWMS[]} for open layers wms, not defined for esri yet
 */
export async function GetWMSCanton(cantonAbbrev) {
    const canton = await getCantonJson(cantonAbbrev);
    const wmsList = await getWMSList(canton);

    let imageWmsList = [];
    //multiple wms possible
    for (const wmsItem of wmsList) {
        if (wmsItem.infoFormat !== 'arcgis/json') {     //openlayers WMS
            const imageWms = await imageWMSFactory(wmsItem);
            imageWmsList.push(imageWms);
        }
        else {                                          //Esri ArcGIS REST 
            // const url = await esriRestFeatureFactory(wmsItem, easting, northing);
            // imageWmsList.push(url);

            //TODO:

            throw new Error('not implemented yet');
        }
    }

    return imageWmsList;
}

/**
 * GetWMSLegendCanton
 * @param  {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @return {string[]} legend urls
 */
export async function GetWMSLegendCanton(cantonAbbrev) {
    const imageWmsList = await GetWMSCanton(cantonAbbrev);

    let legendUrlList = [];
    for (const imageWmsItem of imageWmsList) {
        const legendItem = imageWmsItem.getLegendUrl();
        legendUrlList.push(legendItem);
    }

    return legendUrlList;
}

/**
 * CheckSuitabilityCanton
 * @param {number} easting LV95 Easting in (m)
 * @param {number} northing  LV95 Northing in (m)
 * @param {string} cantonAbbrev two letter abbreviation for canton, e.g. 'AG'
 * @returns {number} harmonised suitability value
 */
export async function CheckSuitabilityCanton(easting, northing, cantonAbbrev) {

    //Check perimeter
    const lowerleft = [2458000, 1076375];
    const upperright = [2862500, 1289125];
    if (easting < lowerleft[0] || easting > upperright[0] ||
        northing < lowerleft[1] || northing > upperright[1]) {
        throw new Error('Not in the ESPG 2056 perimeter: ' + lowerleft + '  ' + upperright);
    }

    const style = 'color:red; font-size:20px; font-weight: bold; -webkit-text-stroke: 1px black;'
    console.log("%c CheckSuitabilityCanton ", style);

    // //get canton by abbreviation
    const canton = await getCantonJson(cantonAbbrev);
    if (!canton) {
        console.log('canton abbreviation not supported: ' + cantonAbbrev);
        return 5;        //kategorie weiss=5
    }

    // single vs multiple wms sources
    const wmsList = await getWMSList(canton);

    let mappingSum = 0;                 //the value to map in the harmony map
    for (const wmsItem of wmsList) {

        let url;
        if (wmsItem.infoFormat !== 'arcgis/json') {         //openlayers WMS

            // if (canton.wmsVersion)                           //not needed yet
            //     wmsVersion = canton.wmsVersion;

            const imageWms = await imageWMSFactory(wmsItem);

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

        console.log(url);

        if (url) {
            try {
                //fetch wms url
                url = proxyServer + url;
                console.log(url);
                const response = await fetch(url);
                const dataraw = await response.text();

                console.log(dataraw);

                //handle response
                for (let layer of wmsItem.layers) {
                    console.log('\nlayer name: \t', layer.name);
                    console.log('property name: \t', layer.propertyName);

                    let value;

                    //handle different text formats
                    if (wmsItem.infoFormat === 'application/vnd.ogc.gml') {
                        const featureInfo = new WMSGetFeatureInfo({ layers: layer.name });
                        const feature = featureInfo.readFeatures(dataraw);
                        value = _.first(_.pluck(_.pluck(feature, 'values_'), layer.propertyName));
                    }
                    else if (wmsItem.infoFormat === 'application/geojson' ||
                        wmsItem.infoFormat === 'application/geo+json' ||
                        wmsItem.infoFormat === 'application/json') {

                        let data = JSON.parse(dataraw)
                        if (_.has(data, 'features') && data.features.length > 0) {
                            value = data.features[0].properties[layer.propertyName];
                        }
                        else {
                            value = undefined;
                        }
                    }
                    else if (wmsItem.infoFormat === 'arcgis/json') {
                        let data = JSON.parse(dataraw)
                        if (data.features.length > 0)
                            value = data.features[0].attributes[layer.propertyName];
                        else
                            value = undefined;
                    }
                    else {
                        throw new Error('infoFormat not implemented: ' + wmsItem.infoFormat);
                    }

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
                                console.log('\t list match exact: \t', propertyValue.name);
                                console.log('\t summand:          \t', propertyValue.summand);
                                mappingSum += propertyValue.summand;
                            }
                            else {
                                console.log('\t NO match: \t', value);
                            }
                        }
                        else {                              //search for contains text
                            if (_.filter(propertyValueNames,
                                function (text) {
                                    return value.includes(text);
                                })) {
                                let propertyValue = _.find(layer.propertyValues, i => value.includes(i.name));
                                console.log('\t list match contains: \t', propertyValue.name);
                                console.log('\t summand:             \t', propertyValue.summand);
                                mappingSum += propertyValue.summand;
                            }
                            else {
                                console.log('\t NO match: \t', value);
                            }
                        }
                    }
                    else {      //evaluate presence of property value
                        if (value) {
                            console.log('\t presence match: \t', value);
                            console.log('\t summand:        \t', layer.summand);
                            mappingSum += layer.summand;
                        }
                        // else {
                        //     console.log('\t NO match.');
                        // }

                    }
                }
                console.log('\n---------------------------------------------');
            }
            catch (err) {
                console.log('Error', err);
            }
        }
    }

    // Harmonisation: mappping the response
    if (canton.harmonyMap) {
        let mappingValue = _.find(canton.harmonyMap, i => i.sum === mappingSum);
        if (!mappingValue) {
            if (mappingSum === 0)
                mappingValue = 4;               //Fallback
            else
                mappingValue = undefined;       //TODO: should not happen! --> handle this!
        }
        else {
            mappingValue = mappingValue.value;
        }
        console.log('Mapping Sum:     \t', mappingSum);
        console.log('Harmonised value:\t', mappingValue);
        return mappingValue;
    }
    else {
        console.log('Mapping Sum:     \t', mappingSum);
        console.log('Harmonised value:\t', 'no harmony map found');
        throw new Error('no harmony found for canton ' + canton.name);
    }

}

export default { GetWMSCanton, GetWMSLegendCanton, CheckSuitabilityCanton };