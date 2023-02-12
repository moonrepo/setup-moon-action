import os from 'os';
import path from 'path';
import * as glob from '@actions/glob';

export function getMoonHomeDir() {
	return path.join(os.homedir(), '.moon');
}

export function getMoonToolsDir() {
	return path.join(getMoonHomeDir(), 'tools');
}

export async function getToolchainCacheKey() {
	const toolchainHash = await glob.hashFiles('.moon/toolchain.yml');

	return `moon-toolchain-${process.platform}-${toolchainHash}`;
}
