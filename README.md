[![npm](https://img.shields.io/npm/v/npm-pkgbuild.svg)](https://www.npmjs.com/package/npm-pkgbuild)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/npm-pkgbuild)](https://bundlephobia.com/result?p=npm-pkgbuild)
[![downloads](http://img.shields.io/npm/dm/npm-pkgbuild.svg?style=flat-square)](https://npmjs.org/package/npm-pkgbuild)
[![GitHub Issues](https://img.shields.io/github/issues/npm-pkgbuild/npm-pkgbuild.svg?style=flat-square)](https://github.com/npm-pkgbuild/npm-pkgbuild/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fnpm-pkgbuild%2Fnpm-pkgbuild%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/npm-pkgbuild/npm-pkgbuild/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/npm-pkgbuild/npm-pkgbuild/badge.svg)](https://snyk.io/test/github/npm-pkgbuild/npm-pkgbuild)
[![Coverage Status](https://coveralls.io/repos/npm-pkgbuild/npm-pkgbuild/badge.svg)](https://coveralls.io/github/npm-pkgbuild/npm-pkgbuild)

## npm-pkgbuild

Create ArchLinux, RPM and Debian packages from npm packages.

# usage

In a package directory execute

```shell
npm-pkgbuild --rpm --debian --arch --content build --publish /some/directory
```

This will create a arch, rpm and a debian package of the build dir.


## upload package

```shell
npm-pkgbuild --rpm --debian --arch --content build --publish 'https://my.package-service.com/binaries/linux/{{type}}/{{access}}/{{arch}}'
```

You can specify the package content in package.json.

```json
{
	"pkgbuild": {
		"content": {
			"/some/location" : { "base": "build" },
			"/etc/myconfig.json" : "sample-config.json",
			"/erc/secret" : { "name":  "secret", "mode": "600" }
            "/opt/myapp": [
                {
                  "type": "npm-pack"
                },
                {
                  "type": "node-modules",
                  "withoutDevelpmentDependencies": true
                }
            ]
		},
		"hooks" : "pkg/hooks",
		"output": {
			"debian" : {},
			"rpm" : {},
			"arch" : {}
		},
		"dependencies": { "nginx" : ">=1.12" }
	}
}
```

# content providers

## files (default)

content from the file system

## npm-pack

content as provided by npm pack

## node-modules

content of all (production) dependencies

options:
    - withoutDevelpmentDependencies when to stip away dev dependencies (defaults to true)


# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

- [usage](#usage)
  - [upload package](#upload-package)
- [content providers](#content-providers)
- [files (default)](#files-default)
  - [npm-pack](#npm-pack)
  - [node-modules](#node-modules)
- [API](#api)
    - [Table of Contents](#table-of-contents)
  - [ContentProvider](#contentprovider)
    - [asyncIterator](#asynciterator)
  - [FileContentProvider](#filecontentprovider)
    - [Parameters](#parameters)
    - [name](#name)
  - [NodeModulesContentProvider](#nodemodulescontentprovider)
    - [Parameters](#parameters-1)
    - [name](#name-1)
  - [NPMPackContentProvider](#npmpackcontentprovider)
    - [Parameters](#parameters-2)
    - [name](#name-2)
  - [pkgKeyValuePairOptions](#pkgkeyvaluepairoptions)
  - [fields](#fields)
  - [fields](#fields-1)
  - [fields](#fields-2)
  - [hookMapping](#hookmapping)
  - [hookMapping](#hookmapping-1)
  - [Field](#field)
    - [Properties](#properties)
  - [Packager](#packager)
    - [Parameters](#parameters-3)
    - [tmpdir](#tmpdir)
    - [execute](#execute)
      - [Parameters](#parameters-4)
  - [decodePassword](#decodepassword)
    - [Parameters](#parameters-5)
  - [extractFunctions](#extractfunctions)
    - [Parameters](#parameters-6)
  - [fieldProvider](#fieldprovider)
    - [Parameters](#parameters-7)
  - [Expander](#expander)
    - [Parameters](#parameters-8)
  - [copyEntries](#copyentries)
    - [Parameters](#parameters-9)
- [install](#install)
- [license](#license)

## ContentProvider

Source of package content.

### asyncIterator

List all entries.

Returns **asyncIterator\<ContentEntry>** all entries

## FileContentProvider

**Extends ContentProvider**

Content provided form the file system.

### Parameters

*   `definitions` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

    *   `definitions.pattern` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>)** 
    *   `definitions.base` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** base directory where to find the files
*   `entryProperties`  

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the content provider

## NodeModulesContentProvider

**Extends ContentProvider**

Content from node_modules

### Parameters

*   `definitions`  
*   `entryProperties`  

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the content provider

## NPMPackContentProvider

**Extends ContentProvider**

Content from npm pack.

### Parameters

*   `definitions`  
*   `entryProperties`  

### name

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the content provider

## pkgKeyValuePairOptions

## fields

well known package properties
<https://www.archlinux.org/pacman/PKGBUILD.5.html>

## fields

*   **See**: <https://www.debian.org/doc/debian-policy/ch-controlfields.html>
*   **See**: <https://linux.die.net/man/5/deb-control>

## fields

*   **See**: <https://rpm-packaging-guide.github.io>

## hookMapping

map install hook named from arch to deb

## hookMapping

map install hook named from arch to rpm

## Field

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

*   `alias` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** interchangeable field name
*   `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `default` **any** 
*   `mandatory` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## Packager

### Parameters

*   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### tmpdir

Create tmp directory.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** directory path

### execute

Execute package generation

#### Parameters

*   `sources`  
*   `transformer`  
*   `dependencies`  
*   `options`  
*   `expander`  

## decodePassword

Decode a password

### Parameters

*   `password` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** plaintext password

## extractFunctions

Extract shell functions from a given text

### Parameters

*   `source` **AsyncIterator<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

Returns **AsyncIterator\<FunctionDecl>** 

## fieldProvider

### Parameters

*   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
*   `fields` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

## Expander

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

### Parameters

*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## copyEntries

Copy content from source into destinationDirectory.

### Parameters

*   `source` **AsyncIterator\<ContentEntry>** 
*   `destinationDirectory` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
*   `expander` **[Expander](#expander)**  (optional, default `v=>v`)
*   `attributes` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<ContentEntryAttribute>** 

# install

With [npm](http://npmjs.org) do:

```shell
npm install npm-pkgbuild
```

# license

BSD-2-Clause
