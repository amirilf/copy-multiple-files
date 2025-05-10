import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("copy-multiple-files.helloWorld", async (uri: vscode.Uri, uris: vscode.Uri[] | undefined) => {
    try {
      // selected files
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

      // configs
      const config = vscode.workspace.getConfiguration("copy-multiple-files");
      const separator = config.get<string>("separator", "\n\n\n------------\n\n\n");
      const headerTemplate = config.get<string>("headerTemplate", "/* {relativePath} */\n");

      // read files
      const sections: string[] = [];
      for (const file of files) {
        const filename = path.basename(file.fsPath);
        const relativePath = vscode.workspace.asRelativePath(file.fsPath);
        let header = headerTemplate;
        header = header.replace("{relativePath}", relativePath);
        const fileData = await vscode.workspace.fs.readFile(file);
        const content = Buffer.from(fileData).toString("utf8");
        const section = header + content;
        sections.push(section);
      }
      const result = sections.join(separator);

      // copy to clipboard
      await vscode.env.clipboard.writeText(result);
      vscode.window.showInformationMessage("Selected files copied to clipboard!");
    } catch (error: any) {
      vscode.window.showErrorMessage("Error copying files: " + error.message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
