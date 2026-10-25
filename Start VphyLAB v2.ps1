$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$bundledNode = 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $runtime = $nodeCommand.Source } elseif (Test-Path -LiteralPath $bundledNode) { $runtime = $bundledNode } else { throw 'Install Node.js 20.9 or later, then run this script again.' }
$url = 'http://127.0.0.1:3001/'
function Test-LabReady {
  try { return (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200 } catch { return $false }
}
if (Test-LabReady) { Start-Process $url; exit 0 }
if (-not (Test-Path -LiteralPath '.\node_modules\next\dist\bin\next')) {
  throw 'Dependencies are missing. Run npm ci in this folder, then double-click run.bat again.'
}
$logFolder = Join-Path $PSScriptRoot '.local'
New-Item -ItemType Directory -Path $logFolder -Force | Out-Null
$server = Start-Process -FilePath $runtime -ArgumentList 'node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3001' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logFolder 'server.log') -RedirectStandardError (Join-Path $logFolder 'server-error.log') -PassThru
Write-Host 'Starting VphyLAB v2 on port 3001...'
for ($attempt = 0; $attempt -lt 90; $attempt++) {
  if (Test-LabReady) { Start-Process $url; exit 0 }
  if ($server.HasExited) { throw "The server stopped. Check $logFolder\server-error.log" }
  Start-Sleep -Seconds 1
}
throw "Startup took too long. Check $logFolder\server.log"
