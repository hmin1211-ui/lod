# Legend of Darkness KeySetting Optimizer

Static browser-only version of the Legend of Darkness `.keysetting` analyzer and merger.

## Deploy target

- Vercel project name: `lod-keyopt`
- Expected project URL: `https://lod-keyopt.vercel.app`
- Vercel root directory: `lod-keyopt`
- Build command: empty
- Output directory: `.`

## Runtime behavior

The app uses the browser File System Access API. It reads only immediate `.keysetting` files in the selected folder, analyzes the selected source and target files in browser memory, and creates the merged file in the browser.

No `.keysetting` file content is sent to Vercel by this app.

Browsers do not expose the absolute local folder path selected through `showDirectoryPicker()`. The app can show the selected folder name and retain the folder handle for the next picker start location, but it cannot display `C:\...` from a deployed web page.

For the same reason, the deployed web app cannot force the first picker to open `C:\Nexon\Legend of Darkness R\Config`. After the user selects that folder once, the saved browser handle is used as the first start location for later picker opens.

## Traffic and storage estimate

- Static app files: about 62 KB before Vercel compression.
- Typical observed `.keysetting` file: about 2.7-3.0 KB.
- File analysis and merge traffic: 0 B to Vercel because the selected files are processed locally in the browser.
- Vercel storage needed: only the static HTML/CSS/JS files.

## Deploy

From this directory:

```powershell
vercel link --project lod-keyopt
vercel deploy --prod
```

Or in the Vercel dashboard, create/import a project with `lod-keyopt` as the root directory. The `.vercel.app` URL is assigned from the project name, so the expected URL is `https://lod-keyopt.vercel.app` if that project slug is still available.
