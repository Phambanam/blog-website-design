# Setup WSL Port Forwarding for Backend
# Run this script as Administrator in PowerShell on Windows

$wslIP = wsl hostname -I
$wslIP = $wslIP.Trim()

Write-Host "WSL IP Address: $wslIP"
Write-Host ""

# Remove existing port forwarding rules if they exist
Write-Host "Cleaning up existing port forwarding rules..."
netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0 2>$null
netsh interface portproxy delete v4tov4 listenport=5433 listenaddress=0.0.0.0 2>$null

# Add port forwarding for Backend (3001)
Write-Host "Setting up port forwarding for Backend (port 3001)..."
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$wslIP

# Add port forwarding for PostgreSQL (5433)
Write-Host "Setting up port forwarding for PostgreSQL (port 5433)..."
netsh interface portproxy add v4tov4 listenport=5433 listenaddress=0.0.0.0 connectport=5433 connectaddress=$wslIP

Write-Host ""
Write-Host "Port forwarding setup complete!"
Write-Host ""
Write-Host "You can now access:"
Write-Host "  - Backend API: http://localhost:3001"
Write-Host "  - Swagger Docs: http://localhost:3001/api/docs"
Write-Host "  - PostgreSQL: localhost:5433"
Write-Host ""

# Show current port forwarding rules
Write-Host "Current port forwarding rules:"
netsh interface portproxy show v4tov4
