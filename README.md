# @xutl/semver

One [eXtremely Useful Tool Library](https://xutl.es) to facilitate working with semantic versioning numbers.

## Install

```sh
npm install --save @xutl/semver
```

## Usage

```javascript
import matches, { pick, Version, Requirement } from '@xutl/args';

pick('^1.2.5', '1.1.20', '1.2.5', '1.2.8', '1.3.0', '1.3.2', '2.0.0', '2.0.1'); // 1.2.3
matches('^1.2.5', '1.1.20'); // false
matches('^1.2.5', '1.2.5'); // true
matches('^1.2.5', '1.3.0'); // true
matches('^1.2.5', '2.0.0'); // false

const version = Version.parse('v1.2.5-pre2');
version.major; // 1
version.minor; // 2
version.patch; // 5
version.candidate; // pre2
version.lessThan('2.0.0'); // true
version.greaterThan('v1.2.5-pre1'); // true
version.greaterThan('v1.2.4'); // false
version.equal('1.2.5'); // true
version.same('1.2.5'); // false

const requirement = Requirement.parse('^8.16 || ^10.5 || >=11');
requirement.matches('10.6.0'); // see matches() above
requirement.best('v4.9.1', 'v6.17.1', 'v8.17.0', 'v10.24.1', 'v12.22.1', 'v14.17.1'); // '14.17.1'
```

## License

Copyright 2021 xutl.es

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
