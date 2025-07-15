#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const CONFIG_PATH = path.join(os.homedir(), '.proxy-agent.json');

function loadConfig() {
    if (fs.existsSync(CONFIG_PATH)) {
        const rawData = fs.readFileSync(CONFIG_PATH);
        try {
            return JSON.parse(rawData.toString());
        } catch (e) {
            console.error("Error parsing config file. It might be corrupted.");
            return {};
        }
    }
    return {};
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getProxyCommands(proxyUrl) {
    const isWin = os.platform() === 'win32';
    if (isWin) {
        return `set http_proxy=${proxyUrl}&set https_proxy=${proxyUrl}`;
    } else {
        return `export http_proxy=${proxyUrl} && export https_proxy=${proxyUrl}`;
    }
}

function getUnsetProxyCommands() {
    const isWin = os.platform() === 'win32';
    if (isWin) {
        return `set http_proxy=&set https_proxy=`;
    } else {
        return `unset http_proxy && unset https_proxy`;
    }
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const config = loadConfig();

    switch (command) {
        case 'set':
            const proxyUrl = args[1];
            if (!proxyUrl) {
                console.error('Error: Proxy URL is required.');
                console.error('Usage: agent set <proxy_url>');
                process.exit(1);
            }
            saveConfig({ url: proxyUrl });
            console.log(`Proxy URL saved: ${proxyUrl}`);
            console.log('Run "agent start" to open a new terminal with this proxy.');
            break;

        case 'start':
            if (!config.url) {
                console.error('Error: Proxy URL not set.');
                console.error('Please run "agent set <proxy_url>" first.');
                process.exit(1);
            }

            const platform = os.platform();
            if (platform === 'win32') {
                const cmd = `start cmd.exe /k "set http_proxy=${config.url}&set https_proxy=${config.url}"`;
                exec(cmd, (error) => {
                    if (error) {
                        console.error(`Failed to start new terminal: ${error.message}`);
                        return;
                    }
                });
            } else if (platform === 'darwin') { // macOS
                 const cmd = `osascript -e 'tell application "Terminal" to do script "export http_proxy=${config.url}; export https_proxy=${config.url}"'`;
                 exec(cmd, (error) => {
                    if (error) {
                        console.error(`Failed to start new terminal: ${error.message}`);
                        return;
                    }
                });
            } else { // Linux
                console.log('Auto-start is not supported on your Linux distribution yet.');
                console.log('Please use "eval $(agent on)" instead.');
            }
            break;

        case 'on':
            if (!config.url) {
                console.error('Error: Proxy URL not set.');
                console.error('Please run "agent set <proxy_url>" first.');
                process.exit(1);
            }
            process.stdout.write(getProxyCommands(config.url));
            break;

        case 'off':
            process.stdout.write(getUnsetProxyCommands());
            break;

        case 'status':
            if (config.url) {
                console.log(`Saved proxy URL: ${config.url}`);
            } else {
                console.log('No proxy URL is configured.');
                console.log('Run "agent set <proxy_url>" to configure one.');
            }
            break;

        default:
            console.log('Usage: agent <command>');
            console.log('');
            console.log('Available commands:');
            console.log('  start            Opens a new terminal with the proxy enabled.');
            console.log('  set <proxy_url>  Saves the proxy URL.');
            console.log('  status           Shows the current saved proxy URL.');
            console.log('  on               (Advanced) Outputs commands to apply the proxy.');
            console.log('  off              (Advanced) Outputs commands to disable the proxy.');
            console.log('');
            console.log('Primary usage:');
            console.log('  1. agent set http://your-proxy:port');
            console.log('  2. agent start');
            break;
    }
}

main();
