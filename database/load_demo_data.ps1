<##
Initializes the exact EarlyFlag database contract and inserts the shared demo
dataset. Requires Docker Desktop. It deliberately recreates only data in the
EarlyFlag tables listed in seed_demo_data.sql.
##>

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot

Push-Location $projectRoot
try {
    docker compose up -d
    $schemaExists = docker compose exec -T postgres psql -U earlyflag -d earlyflag_db -tAc "SELECT to_regclass('public.students') IS NOT NULL;"
    if ($schemaExists.Trim() -ne 't') {
        Get-Content -Raw (Join-Path $PSScriptRoot 'schema.sql') |
            docker compose exec -T postgres psql -U earlyflag -d earlyflag_db
    }
    Get-Content -Raw (Join-Path $PSScriptRoot 'seed_demo_data.sql') |
        docker compose exec -T postgres psql -U earlyflag -d earlyflag_db
}
finally {
    Pop-Location
}

Write-Host 'EarlyFlag demo data loaded. Next: cd risk_engine; python compute_risk.py --as-of 2026-08-20'
