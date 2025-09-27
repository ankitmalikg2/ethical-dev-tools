import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as jwt from 'jsonwebtoken';

export function activate(context: vscode.ExtensionContext) {

	let panel: vscode.WebviewPanel | undefined = undefined;
	// Command to create the diff view webview
	let createDiffCommand = vscode.commands.registerCommand('ethical-dev-tools.createDiff', () => {
		if (panel) {
			panel.reveal(vscode.ViewColumn.One);
		} else {
			panel = vscode.window.createWebviewPanel(
				'ethicalDevTools',
				'Ethical Dev Tools',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			panel.webview.html = getWebviewContent(context, 'diffView.html');

			panel.onDidDispose(
				() => {
					panel = undefined;
				},
				null,
				context.subscriptions
			);

			panel.webview.onDidReceiveMessage(
				async message => {
					switch (message.command) {
						case 'findDiff':
							const { text1, text2 } = message;

							try {
								await vscode.workspace.fs.createDirectory(context.globalStorageUri);
								const tempFile1Uri = vscode.Uri.joinPath(context.globalStorageUri, 'file1.txt');
								const tempFile2Uri = vscode.Uri.joinPath(context.globalStorageUri, 'file2.txt');

								await vscode.workspace.fs.writeFile(tempFile1Uri, Buffer.from(text1, 'utf8'));
								await vscode.workspace.fs.writeFile(tempFile2Uri, Buffer.from(text2, 'utf8'));

								vscode.commands.executeCommand('vscode.diff', tempFile1Uri, tempFile2Uri, 'Diff');
							} catch (error) {
								vscode.window.showErrorMessage('Error creating diff: ' + error);
							}
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		}
	});

	let base64Panel: vscode.WebviewPanel | undefined = undefined;
	let base64ToolCommand = vscode.commands.registerCommand('ethical-dev-tools.base64Tool', () => {
		if (base64Panel) {
			base64Panel.reveal(vscode.ViewColumn.One);
		} else {
			base64Panel = vscode.window.createWebviewPanel(
				'base64Tool',
				'Base64 Tool',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			base64Panel.webview.html = getWebviewContent(context, 'base64Tool.html');

			base64Panel.onDidDispose(
				() => {
					base64Panel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});

	let yamlPanel: vscode.WebviewPanel | undefined = undefined;
	let yamlValidatorCommand = vscode.commands.registerCommand('ethical-dev-tools.yamlValidator', () => {
		if (yamlPanel) {
			yamlPanel.reveal(vscode.ViewColumn.One);
		} else {
			yamlPanel = vscode.window.createWebviewPanel(
				'yamlValidator',
				'YAML Validator',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			yamlPanel.webview.html = getWebviewContent(context, 'yamlValidator.html');

			yamlPanel.onDidDispose(
				() => {
					yamlPanel = undefined;
				},
				null,
				context.subscriptions
			);

			yamlPanel.webview.onDidReceiveMessage(
				async message => {
					switch (message.command) {
						case 'validateYaml':
							try {
								yaml.load(message.yaml);
								yamlPanel?.webview.postMessage({
									command: 'validationResult',
									isValid: true
								});
							} catch (error: any) {
								yamlPanel?.webview.postMessage({
									command: 'validationResult',
									isValid: false,
									error: error.message
								});
							}
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		}
	});

	let epochPanel: vscode.WebviewPanel | undefined = undefined;
	let epochToolCommand = vscode.commands.registerCommand('ethical-dev-tools.epochTool', () => {
		if (epochPanel) {
			epochPanel.reveal(vscode.ViewColumn.One);
		} else {
			epochPanel = vscode.window.createWebviewPanel(
				'epochTool',
				'Epoch Tool',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			epochPanel.webview.html = getWebviewContent(context, 'epochTool.html');

			epochPanel.onDidDispose(
				() => {
					epochPanel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});

	let jwtPanel: vscode.WebviewPanel | undefined = undefined;
	let jwtToolCommand = vscode.commands.registerCommand('ethical-dev-tools.jwtTool', () => {
		if (jwtPanel) {
			jwtPanel.reveal(vscode.ViewColumn.One);
		} else {
			jwtPanel = vscode.window.createWebviewPanel(
				'jwtTool',
				'JWT Tool',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			jwtPanel.webview.html = getWebviewContent(context, 'jwtTool.html');

			jwtPanel.onDidDispose(
				() => {
					jwtPanel = undefined;
				},
				null,
				context.subscriptions
			);

			jwtPanel.webview.onDidReceiveMessage(
				async message => {
					switch (message.command) {
						case 'decodeJWT':
							try {
								const decoded = jwt.decode(message.token, { complete: true });
								if (!decoded) {
									throw new Error('Invalid JWT token');
								}

								let verified: boolean | undefined = undefined;
								if (message.secret) {
									try {
										jwt.verify(message.token, message.secret);
										verified = true;
									} catch {
										verified = false;
									}
								}

								jwtPanel?.webview.postMessage({
									command: 'jwtResult',
									success: true,
									header: decoded.header,
									payload: decoded.payload,
									verified: verified
								});
							} catch (error: any) {
								jwtPanel?.webview.postMessage({
									command: 'jwtResult',
									success: false,
									error: error.message
								});
							}
							return;
						case 'createJWT':
							try {
								const payload = JSON.parse(message.payload);
								const signOptions: jwt.SignOptions = {};
								if (message.algorithm) {
									signOptions.algorithm = message.algorithm;
								}
								const token = jwt.sign(payload, message.secret, signOptions);
								jwtPanel?.webview.postMessage({
									command: 'createResult',
									success: true,
									token: token
								});
							} catch (error: any) {
								jwtPanel?.webview.postMessage({
									command: 'createResult',
									success: false,
									error: error.message
								});
							}
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		}
	});

	let jsonYamlPanel: vscode.WebviewPanel | undefined = undefined;
	let jsonYamlToolCommand = vscode.commands.registerCommand('ethical-dev-tools.jsonYamlTool', () => {
		if (jsonYamlPanel) {
			jsonYamlPanel.reveal(vscode.ViewColumn.One);
		} else {
			jsonYamlPanel = vscode.window.createWebviewPanel(
				'jsonYamlTool',
				'JSON <> YAML Converter',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			jsonYamlPanel.webview.html = getWebviewContent(context, 'jsonYamlTool.html');

			jsonYamlPanel.onDidDispose(
				() => {
					jsonYamlPanel = undefined;
				},
				null,
				context.subscriptions
			);

			jsonYamlPanel.webview.onDidReceiveMessage(
				async message => {
					switch (message.command) {
						case 'jsonToYaml':
							try {
								const jsonObject = JSON.parse(message.json);
								const yamlString = yaml.dump(jsonObject);
								jsonYamlPanel?.webview.postMessage({
									command: 'yamlResult',
									success: true,
									yaml: yamlString
								});
							} catch (error: any) {
								jsonYamlPanel?.webview.postMessage({
									command: 'yamlResult',
									success: false,
									error: error.message
								});
							}
							return;
						case 'yamlToJson':
							try {
								const jsonObject = yaml.load(message.yaml);
								const jsonString = JSON.stringify(jsonObject, null, 2);
								jsonYamlPanel?.webview.postMessage({
									command: 'jsonResult',
									success: true,
									json: jsonString
								});
							} catch (error: any) {
								jsonYamlPanel?.webview.postMessage({
									command: 'jsonResult',
									success: false,
									error: error.message
								});
							}
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		}
	});

	// Register the TreeDataProvider for the sidebar
	const ethicalDevToolProvider = new EthicalDevToolProvider();
	vscode.window.registerTreeDataProvider('ethical-dev-tools-view', ethicalDevToolProvider);

	let jsonToolPanel: vscode.WebviewPanel | undefined = undefined;
	let jsonToolCommand = vscode.commands.registerCommand('ethical-dev-tools.jsonTool', () => {
		if (jsonToolPanel) {
			jsonToolPanel.reveal(vscode.ViewColumn.One);
		} else {
			jsonToolPanel = vscode.window.createWebviewPanel(
				'jsonTool',
				'JSON Tools',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
				}
			);

			jsonToolPanel.webview.html = getWebviewContent(context, 'jsonTool.html');

			jsonToolPanel.onDidDispose(
				() => {
					jsonToolPanel = undefined;
				},
				null,
				context.subscriptions
			);

			jsonToolPanel.webview.onDidReceiveMessage(
				async message => {
					try {
						switch (message.command) {
							case 'validateJson':
								JSON.parse(message.json);
								jsonToolPanel?.webview.postMessage({
									command: 'validationResult',
									isValid: true
								});
								break;
							case 'prettifyJson':
								const pretty = JSON.stringify(JSON.parse(message.json), null, 2);
								jsonToolPanel?.webview.postMessage({
									command: 'jsonResult',
									success: true,
									result: pretty
								});
								break;
							case 'minifyJson':
								const mini = JSON.stringify(JSON.parse(message.json));
								jsonToolPanel?.webview.postMessage({
									command: 'jsonResult',
									success: true,
									result: mini
								});
								break;
							case 'stringifyJson':
								const stringified = JSON.stringify(message.json);
								jsonToolPanel?.webview.postMessage({
									command: 'jsonResult',
									success: true,
									result: stringified
								});
								break;
							case 'unstringifyJson':
								const parsedOnce = JSON.parse(message.json);
								if (typeof parsedOnce !== 'string') {
									throw new Error("Input is a valid JSON but not a string literal. Use Prettify/Minify, or Stringify to create a string literal.");
								}
								const parsedTwice = JSON.parse(parsedOnce);
								const result = JSON.stringify(parsedTwice, null, 2);
								jsonToolPanel?.webview.postMessage({
									command: 'jsonResult',
									success: true,
									result: result
								});
								break;
						}
					} catch (error: any) {
						if (message.command === 'validateJson') {
							jsonToolPanel?.webview.postMessage({
								command: 'validationResult',
								isValid: false,
								error: error.message
							});
						} else {
							jsonToolPanel?.webview.postMessage({
								command: 'jsonResult',
								success: false,
								error: error.message
							});
						}
					}
				},
				undefined,
				context.subscriptions
			);
		}
	});

	context.subscriptions.push(createDiffCommand, base64ToolCommand, yamlValidatorCommand, jwtToolCommand, epochToolCommand, jsonYamlToolCommand, jsonToolCommand);
}

export function deactivate() {}

function getWebviewContent(context: vscode.ExtensionContext, viewName: string) {
	const htmlPath = vscode.Uri.joinPath(context.extensionUri, 'src', viewName);
	const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
	return htmlContent;
}

class EthicalDevToolProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
		if (element) {
			return Promise.resolve([]);
		} else {
			const diffToolItem = new vscode.TreeItem('Create Diff', vscode.TreeItemCollapsibleState.None);
			diffToolItem.command = {
				command: 'ethical-dev-tools.createDiff',
				title: 'Create Diff View',
				tooltip: 'Open a new diff view'
			};
			diffToolItem.iconPath = new vscode.ThemeIcon('diff');


			const base64ToolItem = new vscode.TreeItem('Base64 Tool', vscode.TreeItemCollapsibleState.None);
			base64ToolItem.command = {
				command: 'ethical-dev-tools.base64Tool',
				title: 'Base64 Tool',
				tooltip: 'Open the Base64 tool'
			};
			base64ToolItem.iconPath = new vscode.ThemeIcon('key');

			const yamlValidatorItem = new vscode.TreeItem('YAML Validator', vscode.TreeItemCollapsibleState.None);
			yamlValidatorItem.command = {
				command: 'ethical-dev-tools.yamlValidator',
				title: 'YAML Validator',
				tooltip: 'Validate YAML syntax'
			};
			yamlValidatorItem.iconPath = new vscode.ThemeIcon('check');

			const jwtToolItem = new vscode.TreeItem('JWT Tool', vscode.TreeItemCollapsibleState.None);
			jwtToolItem.command = {
				command: 'ethical-dev-tools.jwtTool',
				title: 'JWT Tool',
				tooltip: 'Decode and verify JWT tokens'
			};
			jwtToolItem.iconPath = new vscode.ThemeIcon('shield');

			const epochToolItem = new vscode.TreeItem('Epoch Tool', vscode.TreeItemCollapsibleState.None);
			epochToolItem.command = {
				command: 'ethical-dev-tools.epochTool',
				title: 'Epoch Tool',
				tooltip: 'Convert between epoch timestamps and human readable dates'
			};
			epochToolItem.iconPath = new vscode.ThemeIcon('clock');

			const jsonYamlToolItem = new vscode.TreeItem('JSON <> YAML Converter', vscode.TreeItemCollapsibleState.None);
			jsonYamlToolItem.command = {
				command: 'ethical-dev-tools.jsonYamlTool',
				title: 'JSON <> YAML Converter',
				tooltip: 'Convert between JSON and YAML'
			};
			jsonYamlToolItem.iconPath = new vscode.ThemeIcon('file-code');

			const jsonToolItem = new vscode.TreeItem('JSON Tools', vscode.TreeItemCollapsibleState.None);
			jsonToolItem.command = {
				command: 'ethical-dev-tools.jsonTool',
				title: 'JSON Tools',
				tooltip: 'Open JSON tools'
			};
			jsonToolItem.iconPath = new vscode.ThemeIcon('json');

			return Promise.resolve([diffToolItem, base64ToolItem, yamlValidatorItem, jwtToolItem, epochToolItem, jsonYamlToolItem, jsonToolItem]);
		}
	}
}
