## Members

<dl>
<dt><a href="#error">error</a></dt>
<dd><p>on (catched) error, this object contains the error</p>
</dd>
<dt><a href="#proxyServer">proxyServer</a></dt>
<dd><p>Proxy server URL</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#cantonAbbrevList">cantonAbbrevList</a></dt>
<dd><p>All 26 canton abbreviations</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#SetProxyServer">SetProxyServer(url)</a></dt>
<dd><p>Setter for proxyServer</p>
</dd>
<dt><a href="#async_fetch">async_fetch(url)</a> ⇒ <code>string</code></dt>
<dd><p>async_fetch</p>
</dd>
<dt><a href="#getAllCantonsJson">getAllCantonsJson()</a> ⇒ <code>object</code></dt>
<dd><p>getAllCantonsJson</p>
</dd>
<dt><a href="#getCantonJson">getCantonJson(cantonAbbrev)</a> ⇒ <code>object</code></dt>
<dd><p>getCantonJson</p>
</dd>
<dt><a href="#getWMSList">getWMSList(canton)</a> ⇒ <code>Array.&lt;object&gt;</code></dt>
<dd><p>getWMSList</p>
</dd>
<dt><a href="#imageWMSFactory">imageWMSFactory(wmsItem, withProxy, wmsVersion)</a> ⇒ <code>ImageWMS</code></dt>
<dd><p>imageWMSFactory</p>
</dd>
<dt><a href="#esriRestFeatureFactory">esriRestFeatureFactory(featureServerUrl, easting, northing)</a> ⇒ <code>string</code></dt>
<dd><p>esriRestFeatureFactory</p>
</dd>
<dt><a href="#GetWMSCanton">GetWMSCanton(cantonAbbrev, withProxy)</a> ⇒ <code>Array.&lt;ImageWMS&gt;</code></dt>
<dd><p>GetWMSCanton</p>
</dd>
<dt><a href="#GetWMSLegendCanton">GetWMSLegendCanton(cantonAbbrev)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>GetWMSLegendCanton</p>
</dd>
<dt><a href="#CheckSuitabilityCanton">CheckSuitabilityCanton(easting, northing, cantonAbbrev, verbose)</a> ⇒ <code>number</code></dt>
<dd><p>CheckSuitabilityCanton</p>
</dd>
<dt><a href="#checkLinkOk">checkLinkOk(url)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check url for status ok</p>
</dd>
<dt><a href="#TestAllCantons">TestAllCantons()</a> ⇒ <code>object</code></dt>
<dd><p>Test WMS definition for all cantons</p>
</dd>
</dl>

<a name="error"></a>

## error
on (catched) error, this object contains the error

**Kind**: global variable  
<a name="proxyServer"></a>

## proxyServer
Proxy server URL

**Kind**: global variable  
<a name="cantonAbbrevList"></a>

## cantonAbbrevList
All 26 canton abbreviations

**Kind**: global constant  
<a name="SetProxyServer"></a>

## SetProxyServer(url)
Setter for proxyServer

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | proxy server url, e.g. 'https://bfe-cors-anywhere.herokuapp.com/' |

<a name="async_fetch"></a>

## async\_fetch(url) ⇒ <code>string</code>
async_fetch

**Kind**: global function  
**Returns**: <code>string</code> - json  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="getAllCantonsJson"></a>

## getAllCantonsJson() ⇒ <code>object</code>
getAllCantonsJson

**Kind**: global function  
**Returns**: <code>object</code> - all canton definitions from json  
<a name="getCantonJson"></a>

## getCantonJson(cantonAbbrev) ⇒ <code>object</code>
getCantonJson

**Kind**: global function  
**Returns**: <code>object</code> - canton definition from json  

| Param | Type | Description |
| --- | --- | --- |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |

<a name="getWMSList"></a>

## getWMSList(canton) ⇒ <code>Array.&lt;object&gt;</code>
getWMSList

**Kind**: global function  
**Returns**: <code>Array.&lt;object&gt;</code> - list with wms defintions  

| Param | Type | Description |
| --- | --- | --- |
| canton | <code>object</code> | canton defintion from json |

<a name="imageWMSFactory"></a>

## imageWMSFactory(wmsItem, withProxy, wmsVersion) ⇒ <code>ImageWMS</code>
imageWMSFactory

**Kind**: global function  
**Returns**: <code>ImageWMS</code> - ol imageWMS object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| wmsItem | <code>object</code> |  | url and layer definition |
| withProxy | <code>boolean</code> | <code>false</code> | add proxy server to url. default = false |
| wmsVersion | <code>string</code> | <code>&quot;1.3.0&quot;</code> | (optional) default='1.3.0' |

<a name="esriRestFeatureFactory"></a>

## esriRestFeatureFactory(featureServerUrl, easting, northing) ⇒ <code>string</code>
esriRestFeatureFactory

**Kind**: global function  
**Returns**: <code>string</code> - feature server url at position E/N  

| Param | Type | Description |
| --- | --- | --- |
| featureServerUrl | <code>string</code> | base url for esri REST feature server |
| easting | <code>number</code> | LV95 Easting |
| northing | <code>number</code> | LV95 Northing |

<a name="GetWMSCanton"></a>

## GetWMSCanton(cantonAbbrev, withProxy) ⇒ <code>Array.&lt;ImageWMS&gt;</code>
GetWMSCanton

**Kind**: global function  
**Returns**: <code>Array.&lt;ImageWMS&gt;</code> - for open layers wms, not defined for esri yet  

| Param | Type | Description |
| --- | --- | --- |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |
| withProxy | <code>boolean</code> | (optional) add proxy server to url. default = false |

<a name="GetWMSLegendCanton"></a>

## GetWMSLegendCanton(cantonAbbrev) ⇒ <code>Array.&lt;string&gt;</code>
GetWMSLegendCanton

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - legend urls  

| Param | Type | Description |
| --- | --- | --- |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |

<a name="CheckSuitabilityCanton"></a>

## CheckSuitabilityCanton(easting, northing, cantonAbbrev, verbose) ⇒ <code>number</code>
CheckSuitabilityCanton

**Kind**: global function  
**Returns**: <code>number</code> - harmonised suitability value, 999 on error -> check 'error' object1 = Kat 1: Grundsätzlich mit allgemeinen Auflagen zulässig2 = Kat 2: Grundsätzlich mit speziellen Auflagen zulässig3 = Kat 3: Grundsätzlich nicht zulässig4 = Kat 4: Aussage zur Eignung zurzeit nicht möglich5 = Kat 5: Keine Daten vorhanden  

| Param | Type | Description |
| --- | --- | --- |
| easting | <code>number</code> | LV95 Easting in (m) |
| northing | <code>number</code> | LV95 Northing in (m) |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |
| verbose | <code>boolean</code> | (optional) activate console log |

<a name="checkLinkOk"></a>

## checkLinkOk(url) ⇒ <code>boolean</code>
Check url for status ok

**Kind**: global function  
**Returns**: <code>boolean</code> - status=ok  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="TestAllCantons"></a>

## TestAllCantons() ⇒ <code>object</code>
Test WMS definition for all cantons

**Kind**: global function  
**Returns**: <code>object</code> - test result for all cantons  
