import fs from 'node:fs';
import * as cache from '@actions/cache';
import * as core from '@actions/core';
import { getToolchainCacheKey, getToolsDir } from './helpers';

async function run() {
	if (!cache.isFeatureAvailable()) {
		return;
	}

	if (!fs.existsSync(getToolsDir())) {
		core.warning(`Toolchain does not exist, not saving cache`);
		return;
	}

	try {
		const primaryKey = await getToolchainCacheKey();
		const cacheHitKey = core.getState('cacheHitKey');

		if (cacheHitKey === primaryKey) {
			core.info(`Cache hit occured on the key ${cacheHitKey}, not saving cache`);
			return;
		}

		core.info(`Saving cache with key ${primaryKey}`);

		await cache.saveCache([getToolsDir()], primaryKey, {}, false);
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void run();
