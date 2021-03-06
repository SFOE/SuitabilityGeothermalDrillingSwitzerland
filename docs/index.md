## Welcome to SuitabilityGeothermalDrillingSwitzerland documentation

### Documentation

Please find the documentation of the library [here](documentation.html)

### Monitoring of the cantonal interfaces

For current state (run daily) of all checks of all cantonal interfaces please visit [Link](cantons_test.html)

### How to use the library

There are three examples:
* The web app [www.kann-ich-bohren.ch](http://www.kann-ich-bohren.ch) (see [Code](https://github.com/SFOE/SuitabilityGeothermalDrillingSwitzerland-WebApp))
* A working example in the example directory and online on [Link](example/)
* A very simple example of an HTML page showing the suitability of drilling at a given coordinate can be implemented as follows (Working sample on [Simple example](example/simple_example.html)). Please don't forget to save the cantons.json on the same path as the javascript file.

```
<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <title>BFE Erdwärmensondentool</title>
    <script defer src="SuitabilityGeothermalDrillingSwitzerland.min.js"></script>
</head>

<body>
    <div id="result">Calculating result. Please wait...</div>

    <script>
		var result = document.getElementById("result");
		window.addEventListener("load", function () {
			BfeLib.CheckSuitabilityCanton(2601561, 1205318, "BE").then(harmonisedValue => {
                if (harmonisedValue == 1) result.innerHTML = 'Kat 1: Grundsätzlich mit allgemeinen Auflagen zulässig';
                else if (harmonisedValue == 2) result.innerHTML = 'Kat 2: Grundsätzlich mit speziellen Auflagen zulässig';
                else if (harmonisedValue == 3) result.innerHTML = 'Kat 3: Grundsätzlich nicht zulässig';
                else if (harmonisedValue == 4) result.innerHTML = 'Kat 4: Aussage zur Eignung zurzeit nicht möglich';
                else if (harmonisedValue == 5) result.innerHTML = 'Kat 5: Keine Daten vorhanden';
                else if (harmonisedValue == 999) result.innerHTML = 'Allgemeiner Fehler';
            });

        });
	</script>
</body>
</html>
```



