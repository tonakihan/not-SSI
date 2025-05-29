# not-ssi
Allows you to using the syntax of SSI in html.
It was created only to collect one HTML of several.

## Interface
So far, available next tags:
- include `<!--#include file=""-->`

## Launch
Launch in cli
```sh
#Template: node [params_nodejs] index.js [params_of_script] path/to/your_target.html
node index.js your_target.html

# Or from another place in system
#Template: node [params_nodejs] path/to/index.js [params_of_script] your_target.html
```
Input (target.html)
```html
<html>
    <some_tags />
    <!-- #include file="maps.html" -->
</html
```
