param([switch]$Force)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskOutput = Join-Path $taskRoot '.local\rea'
New-Item -ItemType Directory -Force -Path $taskOutput | Out-Null
$taskSources = @('store/beanFileStore.js','store/ritualStore.js','api/monthlyCatalog.js','utils/semanticClient.js','store/discoveryStore.js')
$taskFingerprint = 'rea:6.5.0:' + (($taskSources | ForEach-Object { (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $taskRoot "frontend/src/$_")).Hash }) -join ':')
$taskMarker = Join-Path $taskOutput 'review-fingerprint.txt'
$taskEvidence = Join-Path $taskOutput 'connections-current.json'
if (!$Force -and (Test-Path -LiteralPath $taskMarker) -and (Test-Path -LiteralPath $taskEvidence) -and ([IO.File]::ReadAllText($taskMarker) -eq $taskFingerprint)) {
  Write-Output '{"changed":false,"reaVersion":"6.5.0","reused":true}'
  exit 0
}
$taskArgs = @('--yes','rea-agents@6.5.0','analyze-javascript-application',(Join-Path $taskRoot 'frontend\src'))
foreach ($taskSource in $taskSources) { $taskArgs += @('--source-path',$taskSource) }
$taskArgs += @('--format','json')
& npx.cmd @taskArgs > "$taskEvidence.next"
if ($LASTEXITCODE -ne 0) { throw "REA analysis failed (exit $LASTEXITCODE); previous evidence is preserved." }
$taskParsed = Get-Content -LiteralPath "$taskEvidence.next" -Raw | ConvertFrom-Json
if (!$taskParsed.evidence_id -or !$taskParsed.normalized_result.statistics) { throw 'REA returned an unexpected evidence format.' }
Move-Item -LiteralPath "$taskEvidence.next" -Destination $taskEvidence -Force
[IO.File]::WriteAllText($taskMarker,$taskFingerprint)
@{changed=$true;reaVersion='6.5.0';evidence=$taskParsed.evidence_id;parsedFiles=$taskParsed.normalized_result.statistics.parsed_javascript_files;parseFailures=$taskParsed.normalized_result.statistics.parse_failures;limitations=$taskParsed.limitations} | ConvertTo-Json -Compress
