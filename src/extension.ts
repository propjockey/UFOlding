import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext) {
  const foldingProvider = {
    provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
      const ranges: vscode.FoldingRange[] = []
      const text = document.getText()
      const regex = /^([^\S\r\n]*\/\/[^\S\r\n]*)🛸([^\n]*\n)([\w\W]*?)\n^\1(🐄|👽)/gm

      let match
      while ((match = regex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index)
        const endPos = document.positionAt(match.index + match[0].length)
        ranges.push(
          new vscode.FoldingRange(
            startPos.line,
            endPos.line - 1,
            vscode.FoldingRangeKind.Region
          )
        )
        regex.lastIndex = match.index + match[1].length + "🛸".length + match[2].length
      }

      return ranges
    }
  }

  // Register the provider for all document types
  const disposable = vscode.languages.registerFoldingRangeProvider(
    { pattern: "**/*" }, 
    foldingProvider
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
