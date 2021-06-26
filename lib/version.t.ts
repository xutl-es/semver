import { describe, it } from '@xutl/test';
import assert from 'assert';

import { Version } from './version';

describe('version', () => {
	describe('parse', () => {
		it('"test" => throws', () => assert.throws(() => Version.parse('test')));
		it('"-1.2.0" => throws', () => assert.throws(() => Version.parse('-1.2.0')));
		it('"1.-2.0" => throws', () => assert.throws(() => Version.parse('1.-2.0')));

		it('v1.2', () => assert(Version.parse('v1.2').same({ major: 1, minor: 2, patch: 0 })));
		it('v1.2.3', () => assert(Version.parse('v1.2.3').same({ major: 1, minor: 2, patch: 3 })));
		it('v1.2-alpha', () => assert(Version.parse('v1.2-alpha').same({ major: 1, minor: 2, patch: 0, candidate: 'alpha' })));
		it('v1.2.3-alpha', () => assert(Version.parse('v1.2.3-alpha').same({ major: 1, minor: 2, patch: 3, candidate: 'alpha' })));

		it('1.2', () => assert(Version.parse('1.2').same({ major: 1, minor: 2, patch: 0 })));
		it('1.2.3', () => assert(Version.parse('1.2.3').same({ major: 1, minor: 2, patch: 3 })));
		it('1.2-alpha', () => assert(Version.parse('1.2-alpha').same({ major: 1, minor: 2, patch: 0, candidate: 'alpha' })));
		it('1.2.3-alpha', () => assert(Version.parse('1.2.3-alpha').same({ major: 1, minor: 2, patch: 3, candidate: 'alpha' })));
	});
	describe('sort', () => {
		it('2.0 = 2.0', () => assert.strictEqual(Version.sort('2.0', '2.0'), 0));
		it('1.0 < 2.0', () => assert.strictEqual(Version.sort('1.0', '2.0'), -1));
		it('2.0 > 1.0', () => assert.strictEqual(Version.sort('2.0', '1.0'), 1));

		it('1.0 = 1.0', () => assert.strictEqual(Version.sort('1.0', '1.0'), 0));
		it('1.0 < 1.1', () => assert.strictEqual(Version.sort('1.0', '1.1'), -1));
		it('1.1 > 1.0', () => assert.strictEqual(Version.sort('1.1', '1.0'), 1));

		it('1.0.0 = 1.0.0', () => assert.strictEqual(Version.sort('1.0.0', '1.0.0'), 0));
		it('1.0.0 < 1.0.1', () => assert.strictEqual(Version.sort('1.0.0', '1.0.1'), -1));
		it('1.0.1 > 1.0.0', () => assert.strictEqual(Version.sort('1.0.1', '1.0.0'), 1));

		it('1.0.0-pre = 1.0.0-pre', () => assert.strictEqual(Version.sort('1.0.0-pre', '1.0.0-pre'), 0));
		it('1.0.0-alpha < 1.0.0-beta', () => assert.strictEqual(Version.sort('1.0.0-alpha', '1.0.0-beta'), -1));
		it('1.0.0-beta > 1.0.0-alpha', () => assert.strictEqual(Version.sort('1.0.0-beta', '1.0.0-alpha'), 1));
	});
	describe('compare', () => {
		it('2.0 = 2.0', () => assert(Version.parse('2.0').equal('2.0')));
		it('2.0 == 2.0', () => assert(Version.parse('2.0').same('2.0')));
		it('1.0 < 2.0', () => assert(Version.parse('1.0').lessThan('2.0')));
		it('2.0 !< 1.0', () => assert(!Version.parse('2.0').lessThan('1.0')));
		it('2.0 > 1.0', () => assert(Version.parse('2.0').greaterThan('1.0')));
		it('1.0 !> 2.0', () => assert(!Version.parse('1.0').greaterThan('2.0')));

		it('1.0 = 1.0', () => assert(Version.parse('1.0').equal('1.0')));
		it('1.0 == 1.0', () => assert(Version.parse('1.0').same('1.0')));
		it('1.0 < 1.1', () => assert(Version.parse('1.0').lessThan('1.1')));
		it('1.1 > 1.0', () => assert(Version.parse('1.1').greaterThan('1.0')));

		it('1.0.0 = 1.0.0', () => assert(Version.parse('1.0.0').equal('1.0.0')));
		it('1.0.0 == 1.0.0', () => assert(Version.parse('1.0.0').same('1.0.0')));
		it('1.0.0 < 1.0.1', () => assert(Version.parse('1.0.0').lessThan('1.0.1')));
		it('1.0.1 > 1.0.0', () => assert(Version.parse('1.0.1').greaterThan('1.0.0')));

		it('1.0.0-pre = 1.0.0-pre', () => assert(Version.parse('1.0.0-pre').same('1.0.0-pre')));
		it('1.0.0-pre == 1.0.0-pre', () => assert(Version.parse('1.0.0-pre').equal('1.0.0-pre')));
		it('1.0.0-alpha != 1.0.0-beta', () => assert(!Version.parse('1.0.0-alpha').same('1.0.0-beta')));
		it('1.0.0-alpha = 1.0.0-beta', () => assert(Version.parse('1.0.0-alpha').equal('1.0.0-beta')));
		it('1.0.0-alpha < 1.0.0-beta', () => assert(Version.parse('1.0.0-alpha').lessThan('1.0.0-beta')));
		it('1.0.0-beta > 1.0.0-alpha', () => assert(Version.parse('1.0.0-beta').greaterThan('1.0.0-alpha')));

		it('1.0.0-beta < 1.0.0', () => assert(Version.parse('1.0.0-beta').lessThan('1.0.0')));
		it('1.0.0-beta < 2.0.0', () => assert(Version.parse('1.0.0-beta').lessThan('2.0.0')));
		it('1.0.0 < 1.0.0-beta', () => assert(!Version.parse('1.0.0').lessThan('1.0.0-beta')));
		it('1.0.0 < 2.0.0-beta', () => assert(Version.parse('1.0.0').lessThan('2.0.0-beta')));
		it('1.0.1 > 1.0.1-beta', () => assert(Version.parse('1.0.1').greaterThan('1.0.1-beta')));
		it('1.0.1 > 1.0.0-beta', () => assert(Version.parse('1.0.1').greaterThan('1.0.0-beta')));
	});
	describe('string', () => {
		it('1.0 => 1.0.0', () => assert.strictEqual(Version.parse('1.0').toString(), '1.0.0'));
		it('v1.0 => 1.0.0', () => assert.strictEqual(Version.parse('v1.0').toString(), '1.0.0'));
		it('1.2.3 => 1.2.3', () => assert.strictEqual(Version.parse('1.2.3').toString(), '1.2.3'));
		it('v1.2.3 => 1.2.3', () => assert.strictEqual(Version.parse('v1.2.3').toString(), '1.2.3'));
		it('1.2.3-pre => 1.2.3-pre', () => assert.strictEqual(Version.parse('v1.2.3-pre').toString(), '1.2.3-pre'));
		it('v1.2.3-pre => 1.2.3-pre', () => assert.strictEqual(Version.parse('v1.2.3-pre').toString(), '1.2.3-pre'));
	});
});
