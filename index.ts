import os from 'os';
import path from 'path';
import execa from 'execa';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

async function installMoon() {
	core.debug('Installing `moon` globally');

	const version = core.getInput('version') || 'latest';
	const installScript = await tc.downloadTool('https://moonrepo.dev/install.sh');
	const binPath = path.join(
		os.homedir(),
		'.moon/tools/moon',
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

async function run() {
	try {
		await installMoon();
	} catch (error: unknown) {
		core.setFailed((error as Error).message);
	}
}

void run();
