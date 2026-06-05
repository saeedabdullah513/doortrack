# Workaround for Windows EPERM error when prisma generate renames .node files
Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction SilentlyContinue
npx prisma generate 2>&1
$tmpFiles = Get-ChildItem "node_modules\.prisma\client" -Filter "*.tmp*" -ErrorAction SilentlyContinue
if ($tmpFiles) {
    foreach ($f in $tmpFiles) {
        $target = $f.FullName -replace '\.tmp\d+$', ''
        Move-Item -LiteralPath $f.FullName -Destination $target -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Manually moved prisma engine files (Windows EPERM workaround)"
}
