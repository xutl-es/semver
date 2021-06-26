import { describe, it } from '@xutl/test';
import assert from 'assert';

import { Requirement, BaseRequirement } from './requirement';
import { Version } from './version';

describe('requirement', () => {
	describe('base', () => {
		describe('>=', () => {
			it('>=1.2.5 : 1.2.1', () => assert(!BaseRequirement.parse('>=1.2.5').matches(Version.parse('1.2.1'))));
			it('>=1.2.5 : 1.2.5', () => assert(BaseRequirement.parse('>=1.2.5').matches(Version.parse('1.2.5'))));
			it('>=1.2.5 : 1.2.5-pre1', () => assert(!BaseRequirement.parse('>=1.2.5').matches(Version.parse('1.2.5-pre1'))));
			it('>=1.2.5 : 1.2.8', () => assert(BaseRequirement.parse('>=1.2.5').matches(Version.parse('1.2.8'))));
			it('>=1.2.5 : 1.3.0', () => assert(BaseRequirement.parse('>=1.2.5').matches(Version.parse('1.3.0'))));
			it('>=1.2.5 : 2.2.5', () => assert(BaseRequirement.parse('>=1.2.5').matches(Version.parse('2.2.5'))));
			it('>=1.2.5 : 3.2.5', () => assert(BaseRequirement.parse('>=1.2.5').matches(Version.parse('3.2.5'))));
		});
		describe('>', () => {
			it('>1.2.5 : 1.2.1', () => assert(!BaseRequirement.parse('>1.2.5').matches(Version.parse('1.2.1'))));
			it('>1.2.5 : 1.2.5', () => assert(!BaseRequirement.parse('>1.2.5').matches(Version.parse('1.2.5'))));
			it('>1.2.5 : 1.2.8', () => assert(BaseRequirement.parse('>1.2.5').matches(Version.parse('1.2.8'))));
			it('>1.2.5 : 1.3.0', () => assert(BaseRequirement.parse('>1.2.5').matches(Version.parse('1.3.0'))));
			it('>1.2.5 : 2.2.5', () => assert(BaseRequirement.parse('>1.2.5').matches(Version.parse('2.2.5'))));
			it('>1.2.5 : 3.2.5', () => assert(BaseRequirement.parse('>1.2.5').matches(Version.parse('3.2.5'))));
		});
		describe('<=', () => {
			it('<=2.2.2 : 1.2.1', () => assert(BaseRequirement.parse('<=2.2.2').matches(Version.parse('1.2.1'))));
			it('<=2.2.2 : 1.2.5', () => assert(BaseRequirement.parse('<=2.2.2').matches(Version.parse('1.2.5'))));
			it('<=2.2.2 : 1.2.8', () => assert(BaseRequirement.parse('<=2.2.2').matches(Version.parse('1.2.8'))));
			it('<=2.2.2 : 1.3.0', () => assert(BaseRequirement.parse('<=2.2.2').matches(Version.parse('1.3.0'))));
			it('<=2.2.2 : 2.2.5', () => assert(!BaseRequirement.parse('<=2.2.2').matches(Version.parse('2.2.5'))));
			it('<=2.2.2 : 3.2.5', () => assert(!BaseRequirement.parse('<=2.2.5').matches(Version.parse('3.2.5'))));
		});
		describe('<', () => {
			it('<2.2.2 : 1.2.1', () => assert(BaseRequirement.parse('<2.2.2').matches(Version.parse('1.2.1'))));
			it('<2.2.2 : 1.2.5', () => assert(BaseRequirement.parse('<2.2.2').matches(Version.parse('1.2.5'))));
			it('<2.2.2 : 1.2.8', () => assert(BaseRequirement.parse('<2.2.2').matches(Version.parse('1.2.8'))));
			it('<2.2.2 : 2.2.2', () => assert(!BaseRequirement.parse('<2.2.2').matches(Version.parse('2.2.2'))));
			it('<2.2.2 : 2.2.5', () => assert(!BaseRequirement.parse('<2.2.2').matches(Version.parse('2.2.5'))));
			it('<2.2.2 : 3.2.5', () => assert(!BaseRequirement.parse('<2.2.5').matches(Version.parse('3.2.5'))));
		});
		describe('=', () => {
			it('=2.2.2 : 1.2.1', () => assert(!BaseRequirement.parse('=2.2.2').matches(Version.parse('1.2.1'))));
			it('=2.2.2 : 1.2.5', () => assert(!BaseRequirement.parse('=2.2.2').matches(Version.parse('1.2.5'))));
			it('=2.2.2 : 1.2.8', () => assert(!BaseRequirement.parse('=2.2.2').matches(Version.parse('1.2.8'))));
			it('=2.2.2 : 2.2.2', () => assert(BaseRequirement.parse('=2.2.2').matches(Version.parse('2.2.2'))));
			it('=2.2.2 : 2.2.5', () => assert(!BaseRequirement.parse('=2.2.2').matches(Version.parse('2.2.5'))));
			it('=2.2.2 : 3.2.5', () => assert(!BaseRequirement.parse('=2.2.5').matches(Version.parse('3.2.5'))));
		});
	});
	describe('parse', () => {
		it('*', () => assert.strictEqual(Requirement.parse('*').toString(), '*'));
		it('1.0.0', () => assert.strictEqual(Requirement.parse('1.0.0').toString(), '=1.0.0'));
		it('<1.0.0', () => assert.strictEqual(Requirement.parse('<1.0.0').toString(), '<1.0.0'));
		it('<=1.0.0', () => assert.strictEqual(Requirement.parse('<=1.0.0').toString(), '<=1.0.0'));
		it('>1.0.0', () => assert.strictEqual(Requirement.parse('>1.0.0').toString(), '>1.0.0'));
		it('>=1.0.0', () => assert.strictEqual(Requirement.parse('>=1.0.0').toString(), '>=1.0.0'));
		it('^1.2.5', () => assert.strictEqual(Requirement.parse('^1.2.5').toString(), '>=1.2.5 <2.0.0'));
		it('~1.2.5', () => assert.strictEqual(Requirement.parse('~1.2.5').toString(), '>=1.2.5 <1.3.0'));
		it('>=1.2.5 <2.0.0', () => assert.strictEqual(Requirement.parse('>=1.2.5 <2.0.0').toString(), '>=1.2.5 <2.0.0'));
		it('>=1.2.5 || <2.0.0', () => assert.strictEqual(Requirement.parse('>=1.2.5 || <2.0.0').toString(), '>=1.2.5 || <2.0.0'));
		it('>=1.2.5 || <2.0.0 || =3.0.0', () => assert.strictEqual(Requirement.parse('>=1.2.5 || <2.0.0 || =3.0.0').toString(), '>=1.2.5 || <2.0.0 || =3.0.0'));
		it('~1.2.5 || ~1.3.7 || ^2.0.0', () => assert.strictEqual(Requirement.parse('~1.2.5 || ~1.3.7 || ^2.0.0').toString(), '>=1.2.5 <1.3.0 || >=1.3.7 <1.4.0 || >=2.0.0 <3.0.0'));
	});
	describe('match', () => {
		describe('exact', () => {
			it('1.2.5 1.2.5', () => assert(Requirement.matches('1.2.5', '1.2.5')));
			it('=1.2.5 1.2.5', () => assert(Requirement.matches('=1.2.5', '1.2.5')));
			it('=1.2.5 1.2.6', () => assert(!Requirement.matches('=1.2.5', '1.2.6')));
		});
		describe('tilde', () => {
			it('~1.2.5 1.2.3', () => assert(!Requirement.matches('~1.2.5', '1.2.3')));
			it('~1.2.5 1.2.9', () => assert(Requirement.matches('~1.2.5', '1.2.9')));
			it('~1.2.5 1.3.1', () => assert(!Requirement.matches('~1.2.5', '1.3.1')));
			it('~1.2.5 1.4.5', () => assert(!Requirement.matches('~1.2.5', '1.4.5')));
			it('~1.2.5 2.1.3', () => assert(!Requirement.matches('~1.2.5', '2.1.3')));
		});
		describe('caret', () => {
			it('^1.2.5 1.2.3', () => assert(!Requirement.matches('^1.2.5', '1.2.3')));
			it('^1.2.5 1.2.9', () => assert(Requirement.matches('^1.2.5', '1.2.9')));
			it('^1.2.5 1.3.1', () => assert(Requirement.matches('^1.2.5', '1.3.1')));
			it('^1.2.5 1.4.5', () => assert(Requirement.matches('^1.2.5', '1.4.5')));
			it('^1.2.5 2.1.3', () => assert(!Requirement.matches('^1.2.5', '2.1.3')));
		});
		describe('range', () => {
			it('1.2.5 - 1.3.0 1.2.3', () => assert(!Requirement.matches('1.2.5 - 1.3.0', '1.2.3')));
			it('1.2.5 - 1.3.0 1.2.6', () => assert(Requirement.matches('1.2.5 - 1.3.0', '1.2.6')));
			it('1.2.5 - 1.3.0 1.3.3', () => assert(!Requirement.matches('1.2.5 - 1.3.0', '1.3.3')));
		});
		describe('or', () => {
			it('~1.2.5 || ~1.3.7 || ^2.0.0 1.2.3', () => assert(!Requirement.matches('~1.2.5 || ~1.3.7 || ^2.0.0', '1.2.3')));
			it('~1.2.5 || ~1.3.7 || ^2.0.0 1.2.5', () => assert(Requirement.matches('~1.2.5 || ~1.3.7 || ^2.0.0', '1.2.5')));
			it('~1.2.5 || ~1.3.7 || ^2.0.0 1.3.3', () => assert(!Requirement.matches('~1.2.5 || ~1.3.7 || ^2.0.0', '1.3.3')));
			it('~1.2.5 || ~1.3.7 || ^2.0.0 1.3.8', () => assert(Requirement.matches('~1.2.5 || ~1.3.7 || ^2.0.0', '1.3.8')));
			it('~1.2.5 || ~1.3.7 || ^2.0.0 2.0.1', () => assert(Requirement.matches('~1.2.5 || ~1.3.7 || ^2.0.0', '2.0.1')));
			it('~1.2.5 || ~1.3.7 || ^2.0.0 3.3.3', () => assert(!Requirement.matches('~1.2.5 || ~1.3.7 || ^2.0.0', '3.3.3')));
		});
		describe('candidate', () => {
			it('^1.2.5-pre1 1.2.4', () => assert(!Requirement.matches('^1.2.5-pre1', '1.2.4')));
			it('^1.2.5-pre1 1.2.5-pre1', () => assert(Requirement.matches('>=1.2.5-pre1 <2.0.0', '1.2.5-pre1')));
			it('^1.2.5-pre1 1.2.5-pre2', () => assert(Requirement.matches('^1.2.5-pre1', '1.2.5-pre2')));
			it('^1.2.5-pre1 1.2.5', () => assert(Requirement.matches('^1.2.5-pre1', '1.2.5')));
			it('^1.2.5-pre1 1.2.6', () => assert(Requirement.matches('^1.2.5-pre1', '1.2.6')));
		});
	});
});
