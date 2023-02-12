import path from 'path';
import execa from 'execa';
import * as cache from '@actions/cache';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { getMoonHome, getToolchainCacheKey } from './helpers';

async function installMoon() {
	core.debug('Installing `moon` globally');

	const version = core.getInput('version') || 'latest';
	const installScript = await tc.downloadTool('https://moonrepo.dev/install.sh');
	const binPath = path.join(
		getMoonHome(),
		'tools/moon',
		version,
		process.platform === 'win32' ? 'moon.exe' : 'moon',
	);

	core.debug(`Downloaded installation script to ${installScript}`);

	await execa(
		'bash',
		['-c', installScript, version === 'latest' ? undefined : version].filter(Boolean) as string[],
	);

	core.debug(`Installed binary to ${binPath}`);

	core.addPath(path.dirname(binPath));

	core.debug(`Added installation direction to PATH`);
}

async function restoreCache() {
	if (!cache.isFeatureAvailable()) {
		return;
	}

	const cacheKey = await getToolchainCacheKey();
	const hit = await cache.restoreCache([getMoonHome()], cacheKey, [], {}, false);

	if (hit) {
		core.debug(`Toolchain cache restore using key ${cacheKey}`);
	} else {
		core.warning(`Failed to restore toolchain cache using key ${cacheKey}`);
	}

	core.setOutput('cache-key', hit ?? cacheKey);
	core.setOutput('cache-hit', !!hit);
}

async function run() {
	try {
		await restoreCache();
		await installMoon();
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

void run();
