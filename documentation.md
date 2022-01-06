<a name="module_SuitabilityGeothermalDrillingSwitzerland"></a>

## SuitabilityGeothermalDrillingSwitzerland

* [SuitabilityGeothermalDrillingSwitzerland](#module_SuitabilityGeothermalDrillingSwitzerland)
    * [.error](#module_SuitabilityGeothermalDrillingSwitzerland.error)
    * [.proxyServer](#module_SuitabilityGeothermalDrillingSwitzerland.proxyServer)
    * [.SetProxyServer(url)](#module_SuitabilityGeothermalDrillingSwitzerland.SetProxyServer)
    * [.GetWMSCanton(cantonAbbrev, withProxy, verbose)](#module_SuitabilityGeothermalDrillingSwitzerland.GetWMSCanton) ⇒ <code>Array.&lt;ImageWMS&gt;</code>
    * [.GetWMSLegendCanton(cantonAbbrev)](#module_SuitabilityGeothermalDrillingSwitzerland.GetWMSLegendCanton) ⇒ <code>Array.&lt;string&gt;</code>
    * [.CheckSuitabilityCanton(easting, northing, cantonAbbrev, verbose)](#module_SuitabilityGeothermalDrillingSwitzerland.CheckSuitabilityCanton) ⇒ <code>number</code>
    * [.TestAllCantons(verbose)](#module_SuitabilityGeothermalDrillingSwitzerland.TestAllCantons) ⇒ <code>object</code>

<a name="module_SuitabilityGeothermalDrillingSwitzerland.error"></a>

### BfeLib.error
on (catched) error, this object contains the error

**Kind**: static property of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  
<a name="module_SuitabilityGeothermalDrillingSwitzerland.proxyServer"></a>

### BfeLib.proxyServer
Proxy server URL (Getter)

**Kind**: static property of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  
<a name="module_SuitabilityGeothermalDrillingSwitzerland.SetProxyServer"></a>

### BfeLib.SetProxyServer(url)
Setter for proxyServer

**Kind**: static method of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | proxy server url, e.g. 'https://bfe-cors-anywhere.herokuapp.com/' |

**Example**  
```js
SetProxyServer('https://bfe-cors-anywhere.herokuapp.com/');
```
<a name="module_SuitabilityGeothermalDrillingSwitzerland.GetWMSCanton"></a>

### BfeLib.GetWMSCanton(cantonAbbrev, withProxy, verbose) ⇒ <code>Array.&lt;ImageWMS&gt;</code>
GetWMSCanton

**Kind**: static method of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  
**Returns**: <code>Array.&lt;ImageWMS&gt;</code> - for open layers wms, not defined for esri yet  

| Param | Type | Description |
| --- | --- | --- |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |
| withProxy | <code>boolean</code> | (optional) add proxy server to url. default = false |
| verbose | <code>boolean</code> | (optional) activate console log. default = false |

**Example**  
```js
const imageWmsList = await GetWMSCanton('UR', true);
```
<a name="module_SuitabilityGeothermalDrillingSwitzerland.GetWMSLegendCanton"></a>

### BfeLib.GetWMSLegendCanton(cantonAbbrev) ⇒ <code>Array.&lt;string&gt;</code>
GetWMSLegendCanton

**Kind**: static method of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  
**Returns**: <code>Array.&lt;string&gt;</code> - legend urls  

| Param | Type | Description |
| --- | --- | --- |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |

**Example**  
```js
let legends = await GetWMSLegendCanton('VD');
```
<a name="module_SuitabilityGeothermalDrillingSwitzerland.CheckSuitabilityCanton"></a>

### BfeLib.CheckSuitabilityCanton(easting, northing, cantonAbbrev, verbose) ⇒ <code>number</code>
CheckSuitabilityCanton

**Kind**: static method of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  
**Returns**: <code>number</code> - harmonised suitability value, 999 on error -> check 'error' object- 1 = Kat 1: Grundsätzlich mit allgemeinen Auflagen zulässig- 2 = Kat 2: Grundsätzlich mit speziellen Auflagen zulässig- 3 = Kat 3: Grundsätzlich nicht zulässig- 4 = Kat 4: Aussage zur Eignung zurzeit nicht möglich- 5 = Kat 5: Keine Daten vorhanden  

| Param | Type | Description |
| --- | --- | --- |
| easting | <code>number</code> | LV95 Easting in (m) |
| northing | <code>number</code> | LV95 Northing in (m) |
| cantonAbbrev | <code>string</code> | two letter abbreviation for canton, e.g. 'AG' |
| verbose | <code>boolean</code> | (optional) activate console log |

**Example**  
```js
let result = await CheckSuitabilityCanton(2652462, 1196901, 'LU');
```
<a name="module_SuitabilityGeothermalDrillingSwitzerland.TestAllCantons"></a>

### BfeLib.TestAllCantons(verbose) ⇒ <code>object</code>
Test WMS definition for all cantons

**Kind**: static method of [<code>SuitabilityGeothermalDrillingSwitzerland</code>](#module_SuitabilityGeothermalDrillingSwitzerland)  
**Returns**: <code>object</code> - test result for all cantons  

| Param | Type | Description |
| --- | --- | --- |
| verbose | <code>boolean</code> | (optional) activate detailled console log. default = true |

**Example**  
```js
let result = await TestAllCantons();
```
