import * as cache from '@actions/cache';
import * as core from '@actions/core';
import { getMoonToolsDir, getToolchainCacheKey } from './helpers';

async function run() {
	if (!cache.isFeatureAvailable()) {
		return;
	}

	try {
		const primaryKey = await getToolchainCacheKey();
		const cacheKey = core.getState('cacheKey');

		if (cacheKey === primaryKey) {
			core.info(`Cache hit occured on the primary key ${primaryKey}, not saving cache`);
			return;
		}

		await cache.saveCache([getMoonToolsDir()], cacheKey, {}, false);
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

void run();
