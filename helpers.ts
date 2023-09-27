import os from 'node:os';
import path from 'node:path';
import * as glob from '@actions/glob';

export function getMoonDir() {
	if (process.env.MOON_HOME) {
		return process.env.MOON_HOME;
	}

	return path.join(os.homedir(), '.moon');
}

export function getProtoDir() {
	if (process.env.PROTO_HOME) {
		return process.env.PROTO_HOME;
	}

	return path.join(os.homedir(), '.proto');
}

export function getPluginsDir() {
	return path.join(getProtoDir(), 'plugins');
}

export function getToolsDir() {
	return path.join(getProtoDir(), 'tools');
}

export async function getToolchainCacheKey() {
	const toolchainHash = await glob.hashFiles('.moon/toolchain.yml');

	return `moon-toolchain-${process.platform}-${toolchainHash}`;
}
