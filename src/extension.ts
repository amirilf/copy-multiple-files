import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        "copy-multiple-files.helloWorld",
        async (uri: vscode.Uri, uris: vscode.Uri[] | undefined) => {
            try {
                // Determine selected files
                let files: vscode.Uri[] = [];
                if (uris && Array.isArray(uris)) {
                    files = uris;
                } else if (uri) {
                    files = [uri];
                }

                if (files.length === 0) {
                    vscode.window.showErrorMessage("No files selected.");
                    return;
                }

                // Read and concatenate file contents
                let result = "";
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileData = await vscode.workspace.fs.readFile(file);
                    const content = Buffer.from(fileData).toString("utf8");
                    result += content;
                    if (i < files.length - 1) {
                        result += "\n\n\n------------\n\n\n";
                    }
                }

                // Copy result to the clipboard
                await vscode.env.clipboard.writeText(result);
                vscode.window.showInformationMessage("Selected files copied to clipboard!");
            } catch (error: any) {
                vscode.window.showErrorMessage("Error copying files: " + error.message);
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
