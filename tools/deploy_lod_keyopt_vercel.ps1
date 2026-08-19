param(
  [string]$ProjectName = "lod-keyopt"
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($env:VERCEL_TOKEN)) {
  throw "VERCEL_TOKEN environment variable is required."
}

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$OutDir = Join-Path $Root "vercel-static"
$CalculatorDir = Join-Path $OutDir "calculator"

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
New-Item -ItemType Directory -Force -Path $CalculatorDir | Out-Null

Copy-Item -LiteralPath (Join-Path $Root "lod-keyopt\index.html") -Destination $OutDir -Force
Copy-Item -LiteralPath (Join-Path $Root "lod-keyopt\styles.css") -Destination $OutDir -Force
Copy-Item -LiteralPath (Join-Path $Root "lod-keyopt\app.js") -Destination $OutDir -Force
Copy-Item -LiteralPath (Join-Path $Root "apps\lod-cal\index.html") -Destination $CalculatorDir -Force
Copy-Item -LiteralPath (Join-Path $Root "apps\lod-cal\styles.css") -Destination $CalculatorDir -Force
Copy-Item -LiteralPath (Join-Path $Root "apps\lod-cal\app.js") -Destination $CalculatorDir -Force

$deployConfig = @{
  cleanUrls = $true
  headers = @(
    @{
      source = "/(.*)"
      headers = @(
        @{ key = "Cache-Control"; value = "public, max-age=0, must-revalidate" }
      )
    }
  )
  rewrites = @(
    @{ source = "/calculator"; destination = "/calculator/index.html" },
    @{ source = "/calculator/(.*)"; destination = "/calculator/$1" }
  )
}
$deployConfigPath = Join-Path $OutDir "vercel.json"
$deployConfigJson = $deployConfig | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($deployConfigPath, $deployConfigJson, $utf8NoBom)

$headers = @{
  Authorization = "Bearer $env:VERCEL_TOKEN"
  "Content-Type" = "application/json"
}

$files = @()
Get-ChildItem -LiteralPath $OutDir -File -Recurse | ForEach-Object {
  $relative = $_.FullName.Substring($OutDir.Length).TrimStart("\", "/").Replace("\", "/")
  $bytes = [IO.File]::ReadAllBytes($_.FullName)
  $data = [Convert]::ToBase64String($bytes)
  $files += @{
    file = $relative
    data = $data
    encoding = "base64"
  }
}

$body = @{
  name = $ProjectName
  target = "production"
  files = $files
  projectSettings = @{
    framework = $null
  }
  meta = @{
    source = "codex-rest-api"
    app = "lod-keyopt"
  }
} | ConvertTo-Json -Depth 20

$uri = "https://api.vercel.com/v13/deployments?forceNew=1&skipAutoDetectionConfirmation=1"
$deployment = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body

[pscustomobject]@{
  id = $deployment.id
  name = $deployment.name
  url = "https://$($deployment.url)"
  readyState = $deployment.readyState
  inspectorUrl = $deployment.inspectorUrl
}
