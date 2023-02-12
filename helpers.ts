import os from 'os';
import path from 'path';
import * as glob from '@actions/glob';

export function getMoonHome() {
	return path.join(os.homedir(), '.moon');
}

export async function getToolchainCacheKey() {
	const toolchainHash = await glob.hashFiles('.moon/toolchain.yml');

	return `${process.platform}-${toolchainHash}`;
}
