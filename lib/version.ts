export const VERSIONREGEX = /(\d+)\.(\d+)(?:\.(\d+))?(?:-([a-zA-Z0-9_\-+]+))?/;
const RE_VERSION = new RegExp(`^(?:v|\\^|~|>=|<=|>|<)?${VERSIONREGEX.source}$`);

export interface VersionLike {
	major: number;
	minor?: number;
	patch?: number;
	candidate?: string;
}
export class Version implements VersionLike {
	#major: number;
	#minor?: number;
	#patch?: number;
	#candidate?: string;
	constructor(major: number, minor?: number, patch?: number, prelease?: string) {
		this.#major = Math.floor(Math.abs(major));
		if (undefined !== minor) this.#minor = Math.floor(Math.abs(minor));
		if (undefined !== patch) this.#patch = Math.floor(Math.abs(patch));
		this.#candidate = prelease;
	}
	get major() {
		return this.#major;
	}
	get minor() {
		return this.#minor;
	}
	get patch() {
		return this.#patch;
	}
	get candidate() {
		return this.#candidate;
	}
	get tilde() {
		const ver = new Version(this.major, (this.minor ?? 0) + 1);
		return ver.toString(0);
	}
	get carret() {
		const ver = new Version(this.major + 1);
		return ver.toString(0);
	}
	toString(complete?: number) {
		const main = [this.major];
		if (this.minor !== undefined || complete !== undefined) main.push(this.minor ?? (complete as number));
		if (this.patch !== undefined || complete !== undefined) main.push(this.patch ?? (complete as number));
		if (this.#candidate) {
			return `${main.join('.')}-${this.#candidate}`;
		}
		return main.join('.');
	}
	lessThan(other: VersionLike | string) {
		if ('string' === typeof other) other = Version.parse(other);
		if (this.major !== other.major) return this.major < other.major;
		if ((this.minor ?? 0) !== (other.minor ?? Number.POSITIVE_INFINITY)) return (this.minor ?? 0) < (other.minor ?? Number.POSITIVE_INFINITY);
		if ((this.patch ?? 0) !== (other.patch ?? Number.POSITIVE_INFINITY)) return (this.patch ?? 0) < (other.patch ?? Number.POSITIVE_INFINITY);
		if (this.candidate === undefined && other.candidate === undefined) return false;
		if (this.candidate !== undefined && other.candidate !== undefined) return (this.#candidate ?? '') < (other.candidate ?? '');
		if (this.candidate) return true;
		return false;
	}
	greaterThan(other: VersionLike | string) {
		if ('string' === typeof other) other = Version.parse(other);
		if (this.major !== other.major) return this.major > other.major;
		if ((this.minor ?? 0) !== (other.minor ?? Number.POSITIVE_INFINITY)) return (this.minor ?? 0) > (other.minor ?? Number.POSITIVE_INFINITY);
		if ((this.patch ?? 0) !== (other.patch ?? Number.POSITIVE_INFINITY)) return (this.patch ?? 0) > (other.patch ?? Number.POSITIVE_INFINITY);
		if (this.candidate === undefined && other.candidate === undefined) return false;
		if (this.candidate !== undefined && other.candidate !== undefined) return (this.#candidate ?? '') > (other.candidate ?? '');
		if (!this.candidate) return true;
		return false;
	}
	equal(other: VersionLike | string) {
		if ('string' === typeof other) other = Version.parse(other);
		if (this.major !== other.major) return false;
		if ((this.minor ?? 0) !== (other.minor ?? 0)) return false;
		if ((this.patch ?? 0) !== (other.patch ?? 0)) return false;
		return true;
	}
	same(other: VersionLike | string) {
		if ('string' === typeof other) other = Version.parse(other);
		return this.equal(other) && this.candidate === other.candidate;
	}
	static parse(version: string) {
		const match = RE_VERSION.exec(version);
		if (!match) throw new RangeError(`invalid version string: ${version}`);
		const major = +(match[1] ?? 0);
		const minor = +(match[2] ?? 0);
		const patch = +(match[3] ?? '0');
		const candidate = match[4];
		if (Number.isNaN(major) || major < 0) throw new RangeError(`invalid major version: ${major}`);
		if (Number.isNaN(minor) || minor < 0) throw new RangeError(`invalid minor version: ${minor}`);
		if (Number.isNaN(patch) || patch < 0) throw new RangeError(`invalid patch version: ${patch}`);
		return new Version(major, minor, patch, candidate);
	}
	static sort(a: VersionLike | string, b: VersionLike | string) {
		if ('string' === typeof a) a = Version.parse(a);
		if (!(a instanceof Version)) a = new Version(a.major, a.minor, a.patch, a.candidate);

		if ('string' === typeof b) b = Version.parse(b);
		if (!(b instanceof Version)) b = new Version(b.major, b.minor, b.patch, b.candidate);

		const av = a as Version;
		const bv = b as Version;

		if (av.same(bv)) return 0;
		if (av.lessThan(bv)) return -1;
		if (av.greaterThan(bv)) return 1;
		return 0;
	}
}
