export type VERSIONMODE = 'equals' | 'larger' | 'smaller' | 'largerequal' | 'smallerequal';
export type ANYMODE = 'any';
export type MODE = VERSIONMODE | ANYMODE;

import { Version, VersionLike } from './version';

export interface Matchable {
	matches(version: Version): boolean;
	toString(): string;
}

export enum VersionMode {
	any = 0,
	equal,
	smaller,
	larger,
	smallerEqual,
	largerEqual,
}
const VersionModeStrings = ['*', '=', '<', '>', '<=', '>='];

import { VERSIONREGEX } from './version';

const RE_REQ = new RegExp(`^(=|<|<=|>|>=)?(${VERSIONREGEX.source})$`);
const RE_TIL = new RegExp(`\\~(${VERSIONREGEX.source})`, 'g');
const RE_CAR = new RegExp(`\\^(${VERSIONREGEX.source})`, 'g');
const RE_RAN = new RegExp(`(${VERSIONREGEX.source})\\s*-\\s*(${VERSIONREGEX.source})`, 'g');

export class BaseRequirement implements Matchable {
	#mode: VersionMode;
	#version?: Version;
	constructor(mode: VersionMode, version: Version);
	constructor(mode: VersionMode.any);
	constructor(mode: VersionMode, version?: Version) {
		if (mode === VersionMode.any) {
			this.#mode = mode;
		} else {
			if (!version) throw new TypeError(`version parameter is required for mode ${mode}`);
			this.#mode = mode;
			this.#version = version;
		}
	}
	get mode() {
		return this.#mode;
	}
	get version() {
		return this.#version;
	}
	toString(): string {
		if (this.#mode === VersionMode.any) return '*';
		const prefix = VersionModeStrings[this.#mode as number] as string;
		if (!this.#version) return prefix;
		return `${prefix}${this.#version.toString()}`;
	}
	matches(version: Version): boolean {
		if (this.#mode === VersionMode.any) return true;
		if (this.#version === undefined) return false;

		let result = false;
		switch (this.#mode) {
			case VersionMode.equal:
				result = this.#version.same(version);
				break;
			case VersionMode.smaller:
				result = this.#version.greaterThan(version);
				break;
			case VersionMode.larger:
				result = this.#version.lessThan(version);
				break;
			case VersionMode.smallerEqual:
				result = this.#version.same(version) || this.#version.greaterThan(version);
				break;
			case VersionMode.largerEqual:
				result = this.#version.same(version) || this.#version.lessThan(version);
				break;
		}
		return result;
	}
	static parse(req: string): Matchable {
		if (req === '*') return new BaseRequirement(VersionMode.any);
		const match = RE_REQ.exec(req);
		if (!match) throw new RangeError(`invalid requirement ${req}`);
		const mode = Math.max(VersionModeStrings.indexOf(match[1] ?? '='), 0);
		return new BaseRequirement(mode, Version.parse(match[2] as string));
	}
}

type AGGMODE = 'AND' | 'OR';

class AggregateRequirement implements Matchable {
	#mode: AGGMODE;
	#left: Matchable;
	#right: Matchable;
	constructor(mode: AGGMODE, left: Matchable, right: Matchable) {
		this.#mode = mode;
		this.#left = left;
		this.#right = right;
	}
	matches(version: Version): boolean {
		if (this.#mode === 'AND') {
			return this.#left.matches(version) && this.#right.matches(version);
		}
		return this.#left.matches(version) || this.#right.matches(version);
	}
	toString() {
		return `${this.#left}${this.#mode === 'AND' ? ' ' : ' || '}${this.#right}`;
	}
}

export class Requirement implements Matchable {
	#match: Matchable;
	constructor(match: Matchable) {
		this.#match = match;
	}
	matches(version: VersionLike | string) {
		if ('string' === typeof version) version = Version.parse(version);
		if (!(version instanceof Version)) version = new Version(version.major, version.minor, version.patch, version.candidate);
		return this.#match.matches(version as Version);
	}
	best(...versions: Version[] | string[]): Version | null {
		if (versions.length && 'string' === typeof versions[0]) {
			versions = (versions as string[]).map((v) => Version.parse(v));
		}
		versions = versions
			.map((v) => ('string' === typeof v ? Version.parse(v) : v) as Version)
			.sort(Version.sort)
			.reverse();
		for (const version of versions) {
			if (this.matches(version)) return version;
		}
		return null;
	}
	toString() {
		return this.#match.toString();
	}
	static parse(req: string) {
		req = req
			.replace(RE_TIL, (_, v) => {
				const ver = Version.parse(v);
				const from = ver.toString(0);
				const until = ver.tilde;
				return `>=${from} <${until}`;
			})
			.replace(RE_CAR, (_, v) => {
				const ver = Version.parse(v);
				const from = ver.toString(0);
				const until = ver.carret;
				return `>=${from} <${until}`;
			})
			.replace(RE_RAN, (_, from, _major, _minor, _patch, _cand, until) => {
				return `>=${from} <=${until}`;
			});
		const ors = req
			.split(/\s*\|\|\s*/)
			.map((item) => {
				const ands = item.split(/\s+/);
				return ands.reduce((agg: Matchable | null, val: string) => {
					if (agg === null) return BaseRequirement.parse(val);
					return new AggregateRequirement('AND', agg as Matchable, BaseRequirement.parse(val));
				}, null);
			})
			.filter((i) => i !== null) as Matchable[];
		const match = ors.reduce((agg: Matchable, val: Matchable) => new AggregateRequirement('OR', agg, val));
		return new Requirement(match);
	}
	static matches(req: string, ver: VersionLike | string): boolean {
		return Requirement.parse(req).matches(ver);
	}
}
