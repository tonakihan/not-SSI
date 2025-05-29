# not-ssi
Allows you to using the syntax of SSI in html.
It was created only to collect one HTML of several.

## Interface
So far, available next tags:
- include `<!--#include file=""-->`

## Launch
Run from npm
```sh
npx not-ssi your_target.html
```
Or clone project and launch it in cli
```sh
#Template: node [params_nodejs] bin/not-ssi.mjs [params_of_script] path/to/your_target.html
node bin/not-ssi.mjs your_target.html

# Or from another place in system
#Template: node [params_nodejs] path/to/bin/not-ssi.mjs [params_of_script] your_target.html
```
___
Input (target.html)
```html
<html>
    <some_tags />
    <!-- #include file="maps.html" -->
</html
```
