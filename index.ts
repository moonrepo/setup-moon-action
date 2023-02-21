import fs from 'node:fs';
import path from 'node:path';
import execa from 'execa';
import * as cache from '@actions/cache';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { getMoonToolsDir, getToolchainCacheKey } from './helpers';

const WINDOWS = process.platform === 'win32';

async function installMoon() {
	core.info('Installing `moon` globally');

	const version = core.getInput('version') || 'latest';
	const binPath = path.join(getMoonToolsDir(), 'moon', version, WINDOWS ? 'moon.exe' : 'moon');

	if (version !== 'latest' && fs.existsSync(binPath)) {
		core.info('Binary already exists, skipping installation');
		return;
	}

	const script = await tc.downloadTool(`https://moonrepo.dev/install.${WINDOWS ? 'ps1' : 'sh'}`);
	const args = [script];

	if (version !== 'latest') {
		args.push(version);
	}

	core.info(`Downloaded installation script to ${script}`);

	// eslint-disable-next-line no-magic-numbers
	await fs.promises.chmod(script, 0o755);

	await (WINDOWS ? execa('pwsh.exe', ['-Command', ...args]) : execa('bash', ['-c', ...args]));

	core.info(`Installed binary to ${binPath}`);

	core.addPath(path.dirname(binPath));

	core.info(`Added installation direction to PATH`);
}

async function restoreCache() {
	if (!cache.isFeatureAvailable()) {
		return;
	}

	core.info('Attempting to restore cached toolchain');

	const primaryKey = await getToolchainCacheKey();
	const cacheKey = await cache.restoreCache(
		[getMoonToolsDir()],
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
