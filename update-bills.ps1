$ErrorActionPreference='Stop'
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$sub = Get-ChildItem $base -Directory | Where-Object { Test-Path (Join-Path $_.FullName 'bills.html') } | Select-Object -First 1
$json = Join-Path $base 'update-bills-data.json'
$data = [System.IO.File]::ReadAllText($json, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$enc = New-Object System.Text.UTF8Encoding($false)
$tbody = '<tbody>' + (($data.rows | ForEach-Object {
  $o = $_
  if ($o.link) { $n = '<a href="members/' + $o.link + '">' + $o.name + '</a>' } else { $n = $o.name }
  '<tr><td>' + $n + '</td><td>' + $o.party + '</td><td class="mono">' + $o.rep + '</td><td class="mono">' + $o.invol + '</td><td class="mono">' + $o.pass + '</td><td class="mono">' + "$($o.rate)%" + '</td></tr>'
}) -join '') + '</tbody>'
function Patch($f, $withTbody){
  $t = [System.IO.File]::ReadAllText($f)
  Copy-Item $f ($f + '.bak-20261121') -Force
  foreach($p in $data.stats.PSObject.Properties){ $t = $t.Replace('>' + $p.Name + '<', '>' + $p.Value + '<') }
  foreach($p in $data.labels.PSObject.Properties){ $t = $t.Replace($p.Name, $p.Value) }
  $t = $t.Replace('2026-11-07','2026-11-21')
  if($withTbody){ $t = [System.Text.RegularExpressions.Regex]::Replace($t,'<tbody>.*?</tbody>',$tbody,[System.Text.RegularExpressions.RegexOptions]::Singleline) }
  [System.IO.File]::WriteAllText($f,$t,$enc)
  Write-Output ('OK ' + (Split-Path -Leaf $f) + ' ' + (Get-Item $f).Length)
}
Patch (Join-Path $sub.FullName 'bills.html') $true
Patch (Join-Path $sub.FullName 'index.html') $false
