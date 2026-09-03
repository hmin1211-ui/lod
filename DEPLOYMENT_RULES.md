# Deployment Rules

This repository contains two separate web services. Always confirm the Vercel
project name and Git branch before deploying.

## Services

| Service | Vercel project | Public URL | GitHub branch | Source files |
| --- | --- | --- | --- | --- |
| Damage calculator | `lod-cal` | `https://lod-cal.vercel.app/` | `lod-cal` | `apps/lod-cal/**` |
| Keysetting optimizer | `lod-keyopt` | `https://lod-keyopt.vercel.app/` | `lod-keyopt-github` | `lod-keyopt/**`, keyopt build files |

## Vercel Settings

### `lod-cal`

- Project name: `lod-cal`
- Production branch: `lod-cal`
- Root directory: repository root
- Install command: `echo "No install required"`
- Build command: use the root `vercel.json` on the `lod-cal` branch
  - Current command copies `apps/lod-cal/index.html`, `styles.css`, and `app.js`
    into `vercel-static/` and `vercel-static/calculator/`.
- Output directory: `vercel-static`

### `lod-keyopt`

- Project name: `lod-keyopt`
- Production branch: `lod-keyopt-github`
- Root directory: repository root
- Install command: `echo "No install required"`
- Build command: `node tools/build-static.mjs`
- Output directory: `vercel-static`
- The keyopt build copies:
  - `lod-keyopt/index.html`, `styles.css`, `app.js` to `/`
  - `apps/lod-cal/index.html`, `styles.css`, `app.js` to `/calculator`

## Never Do This

- Do not push the `lod-keyopt-github` branch HEAD to `main` or `lod-cal`.
- Do not push the `lod-cal` or `main` branch HEAD to `lod-keyopt-github`.
- Do not deploy before checking the Vercel project name.
- Do not deploy `lod-cal` if staged files include `lod-keyopt/**`.
- Do not deploy `lod-keyopt` if staged files include unintended `apps/lod-cal/**`.

## Required Checks Before Deploying `lod-cal`

```powershell
git ls-remote --heads github lod-cal lod-keyopt-github main
git branch -vv
git diff --cached --name-only
```

Expected:

- `lod-cal` points to the current damage calculator commit.
- `lod-keyopt-github` points to a keysetting optimizer commit.
- Staged files are only `apps/lod-cal/**` or docs explicitly intended for
  the damage calculator.

After deployment:

```powershell
$calc = Invoke-WebRequest -UseBasicParsing https://lod-cal.vercel.app/calculator/app.js
$keyopt = Invoke-WebRequest -UseBasicParsing https://lod-keyopt.vercel.app/
$calc.Content.Contains("DamageCalculator")
$keyopt.Content -notmatch "어둠의전설 데미지 계산기"
```

## Required Checks Before Deploying `lod-keyopt`

```powershell
git ls-remote --heads github lod-cal lod-keyopt-github main
git branch -vv
git diff --cached --name-only
```

Expected:

- `lod-keyopt-github` points to the keysetting optimizer commit.
- Staged files are only keyopt files or shared build files intentionally used
  by the keyopt project.

After deployment:

```powershell
$keyopt = Invoke-WebRequest -UseBasicParsing https://lod-keyopt.vercel.app/
$keyopt.Content -match "키세팅|옵티마이저|keysetting|Keysetting"
```

## Recovery Notes

- If `lod-cal` receives keyopt files, revert only the keyopt commit on the
  damage calculator branch.
- If `lod-keyopt-github` receives damage calculator files, restore
  `lod-keyopt-github` to the last known keyopt-only commit.
- After any recovery, verify both public URLs return different HTML/JS.
