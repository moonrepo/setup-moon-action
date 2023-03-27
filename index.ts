import fs from 'node:fs';
import path from 'node:path';
import execa from 'execa';
import * as cache from '@actions/cache';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { getHomeDir, getToolchainCacheKey, getToolsDir } from './helpers';

const WINDOWS = process.platform === 'win32';

async function installMoon() {
	core.info('Installing `moon` globally');

	const version = core.getInput('version') || 'latest';
	const tempPath = path.join(getHomeDir(), 'temp', WINDOWS ? 'install.ps1' : 'install.sh');
	const binDir = path.join(getToolsDir(), 'moon', version);
	const binPath = path.join(binDir, WINDOWS ? 'moon.exe' : 'moon');

	if (version !== 'latest' && fs.existsSync(binPath)) {
		core.addPath(binDir);
		core.info('Binary already exists, skipping installation');

		return;
	}

	const script = await tc.downloadTool(
		version === 'latest' || !version.startsWith('0')
			? `https://moonrepo.dev/install/${WINDOWS ? 'moon.ps1' : 'moon.sh'}`
			: `https://moonrepo.dev/${path.basename(tempPath)}`,
		tempPath,
	);
	const args = version === 'latest' ? [] : [version];

	core.info(`Downloaded installation script to ${script}`);

	// eslint-disable-next-line no-magic-numbers
	await fs.promises.chmod(script, 0o755);

	await execa(script, args);

	// Make it available without exe extension
	if (WINDOWS) {
		await fs.promises.copyFile(binPath, path.join(binDir, 'moon'));
	}

	core.info(`Installed binary to ${binPath}`);

	core.addPath(binDir);

	core.info(`Added installation direction to PATH`);
}

async function restoreCache() {
	if (!cache.isFeatureAvailable()) {
		return;
	}

	core.info('Attempting to restore cached toolchain');

	const primaryKey = await getToolchainCacheKey();
	const cacheKey = await cache.restoreCache(
		[getToolsDir()],
		primaryKey,
		[`moon-toolchain-${process.platform}`, 'moon-toolchain'],
		{},
		false,
	);

	if (cacheKey) {
		core.saveState('cacheHitKey', cacheKey);
		core.info(`Toolchain cache restored using key ${primaryKey}`);
	} else {
		core.warning(`Toolchain cache does not exist using key ${primaryKey}`);
	}

	core.setOutput('cache-key', cacheKey ?? primaryKey);
	core.setOutput('cache-hit', !!cacheKey);
}

async function run() {
	try {
		await restoreCache();
		await installMoon();
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void run();
