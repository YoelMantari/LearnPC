$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
$url='http://127.0.0.1:4317'
function Test-Algo { try { (Invoke-RestMethod "$url/api/health" -TimeoutSec 1).app -eq 'AlgoRecall-Web' } catch { $false } }
if (!(Test-Algo)) {
    $node=(Get-Command node -ErrorAction Stop).Source
    $process=Start-Process $node -ArgumentList 'backend/server.mjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru
    for ($attempt=0;$attempt -lt 30;$attempt++){if(Test-Algo){break}; if($process.HasExited){break};Start-Sleep -Milliseconds 200}
    if (!(Test-Algo)){throw 'No se pudo iniciar AlgoRecall. Comprueba que Node.js 24 esté disponible y que el puerto 4317 esté libre.'}
}
Start-Process $url
