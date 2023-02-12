import * as cache from '@actions/cache';
import * as core from '@actions/core';
import { getMoonHome, getToolchainCacheKey } from './helpers';

async function run() {
	if (!cache.isFeatureAvailable()) {
		return;
	}

	try {
		await cache.saveCache([getMoonHome()], await getToolchainCacheKey(), {}, false);
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

void run();
