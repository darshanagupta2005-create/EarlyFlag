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

    # "docker compose up" returns as soon as the container process starts —
    # Postgres itself can still be a few seconds into initdb/startup and not
    # yet accepting connections. Poll pg_isready instead of assuming readiness.
    Write-Host 'Waiting for Postgres to accept connections...'
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        docker compose exec -T postgres pg_isready -U earlyflag -d earlyflag_db *> $null
        if ($LASTEXITCODE -eq 0) {
            $ready = $true
            break
        }
        Start-Sleep -Seconds 1
    }
    if (-not $ready) {
        throw 'Postgres did not become ready within 30 seconds. Run "docker compose logs postgres" to check for errors.'
    }

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