import { Version } from './version';
import { Requirement } from './requirement';

export { Version, Requirement };

export function matches(requirement: string, version: string) : boolean {
  return Requirement.matches(requirement, version);
}

export function pick(requirement: string, ...versions: string[]): string | null {
	const req = Requirement.parse(requirement);
	const vers = versions.map((v) => Version.parse(v));
	const res = req.best(...vers);
	if (!res) return null;
	return res.toString();
}

export default matches;
