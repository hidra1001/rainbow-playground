# 무지개 놀이터를 GitHub Pages에 올립니다. (gh CLI 로그인 필요)
# 사용법: PowerShell에서  .\deploy.ps1
$ErrorActionPreference = "Stop"
# 서비스 워커 캐시 버전을 배포 시각으로 바꿔 태블릿이 새 버전을 받게 해요
$stamp = Get-Date -Format "yyyyMMddHHmm"
$swPath = Join-Path $PSScriptRoot 'sw.js'
(Get-Content $swPath -Raw) -replace "const VERSION = '[^']*';", "const VERSION = 'rainbow-$stamp';" | Set-Content $swPath -NoNewline
$repo = 'rainbow-playground'
$user = (gh api user --jq .login)
Set-Location $PSScriptRoot

if (-not (Test-Path .git)) {
  git init -b main | Out-Null
}
git add -A
git commit -m "무지개 놀이터 앱 배포" --allow-empty | Out-Null

$exists = gh repo view "$user/$repo" 2>$null
if (-not $exists) {
  gh repo create $repo --public --source . --remote origin --push --description "6~9살 산수·한글·두뇌 놀이 PWA"
} else {
  if (-not (git remote | Select-String -Quiet '^origin$')) { git remote add origin "https://github.com/$user/$repo.git" }
  git push -u origin main
}

# GitHub Pages 켜기 (이미 켜져 있으면 무시)
try { gh api -X POST "repos/$user/$repo/pages" -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" | Out-Null } catch {}

Write-Host ""
Write-Host "배포 완료! 1~2분 뒤 이 주소를 갤럭시탭에서 열어 홈 화면에 추가하세요:" -ForegroundColor Green
Write-Host "https://$user.github.io/$repo/" -ForegroundColor Cyan
