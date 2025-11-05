# Remove WSL Port Forwarding
# Run this script as Administrator in PowerShell on Windows

Write-Host "Removing port forwarding rules..."

netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0
netsh interface portproxy delete v4tov4 listenport=5433 listenaddress=0.0.0.0

Write-Host ""
Write-Host "Port forwarding rules removed!"
Write-Host ""
Write-Host "Remaining port forwarding rules:"
netsh interface portproxy show v4tov4
