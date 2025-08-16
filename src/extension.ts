import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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



	// Register the TreeDataProvider for the sidebar
	const ethicalDevToolProvider = new EthicalDevToolProvider();
	vscode.window.registerTreeDataProvider('ethical-dev-tools-diff', ethicalDevToolProvider);

	context.subscriptions.push(createDiffCommand, base64ToolCommand);
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

			return Promise.resolve([diffToolItem, base64ToolItem]);
		}
	}
}
