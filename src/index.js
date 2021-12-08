import BfeLib from './SuitabilityGeothermalDrillingSwitzerland.js';

window.BfeLib = BfeLib;


async function getCantonForCoordinate(easting, northing)
{
    const cantonJson = await fetch('https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPoint&geometry='+easting+','+northing+'&imageDisplay=0,0,0&mapExtent=0,0,0,0&tolerance=0&layers=all:ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&returnGeometry=false&sr=2056');
    const canton = await cantonJson.json();
    
    return canton.results[0].attributes.ak;
}

window.getCantonForCoordinate = getCantonForCoordinate;





