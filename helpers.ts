import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as glob from '@actions/glob';

export function getHomeDir() {
	const proto = path.join(os.homedir(), '.proto');

	if (fs.existsSync(proto)) {
		return proto;
	}

	return path.join(os.homedir(), '.moon');
}

export function getToolsDir() {
	return path.join(getHomeDir(), 'tools');
}

export async function getToolchainCacheKey() {
	const toolchainHash = await glob.hashFiles('.moon/toolchain.yml');

	return `moon-toolchain-${process.platform}-${toolchainHash}`;
}
