# Move Large Assets to External CDN
# Run this script to migrate your large assets to the external drive

Write-Host "Mjolnir CDN Migration Script" -ForegroundColor Cyan
Write-Host "Moving large assets to external drive..." -ForegroundColor Yellow

$sourcePath = ".\public"
$cdnPath = "M:\MjolnirCDN"

# Create destination directories if they don't exist
$destModels = Join-Path $cdnPath "models"
$destImages = Join-Path $cdnPath "images"

New-Item -ItemType Directory -Path $destModels -Force | Out-Null
New-Item -ItemType Directory -Path $destImages -Force | Out-Null

# Assets to move
$assetsToMove = @(
    @{ Source = ".\public\Models\Mjolnir.glb"; Destination = "$destModels\Mjolnir.glb" },
    @{ Source = ".\public\Images\Xicaru.jpeg"; Destination = "$destImages\Xicaru.jpeg" },
    @{ Source = ".\public\Images\Logos\mjolnir_forge_flyer_2025.png"; Destination = "$destImages\mjolnir_forge_flyer_2025.png" },
    @{ Source = ".\public\Images\Mjolnir.jpeg"; Destination = "$destImages\Mjolnir.jpeg" },
    @{ Source = ".\public\Images\BitcoinWizerd.png"; Destination = "$destImages\BitcoinWizerd.png" },
    @{ Source = ".\public\Images\Backgrounds\grid.svg"; Destination = "$destImages\grid.svg" },
    @{ Source = ".\public\Images\Backgrounds\EnergyTunnel.jpeg"; Destination = "$destImages\EnergyTunnel.jpeg" }
)

$movedCount = 0
$totalSize = 0

foreach ($asset in $assetsToMove) {
    if (Test-Path $asset.Source) {
        $fileSize = (Get-Item $asset.Source).Length
        Copy-Item -Path $asset.Source -Destination $asset.Destination -Force
        $sizeMB = [math]::Round($fileSize/1MB, 2)
        Write-Host "Moved: $(Split-Path $asset.Source -Leaf) ($sizeMB MB)" -ForegroundColor Green
        $movedCount++
        $totalSize += $fileSize
    } else {
        Write-Host "Skipped: $(Split-Path $asset.Source -Leaf) (file not found)" -ForegroundColor Yellow
    }
}

$totalSizeMB = [math]::Round($totalSize/1MB, 2)
Write-Host "`nMigration Complete!" -ForegroundColor Cyan
Write-Host "Files moved: $movedCount" -ForegroundColor White
Write-Host "Total size saved: $totalSizeMB MB" -ForegroundColor White
Write-Host "CDN Location: $cdnPath" -ForegroundColor White

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Update your components to use getAssetUrls() from lib/cdn-config.ts" -ForegroundColor White
Write-Host "2. Test your app with: npm run dev" -ForegroundColor White
Write-Host "3. Verify assets load from: http://localhost:3000/cdn/..." -ForegroundColor White