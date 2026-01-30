$registros = @(
  @{data="2026-01-29";prospector="TUC802";polo="Tucuruí";prefixo="TUC802";trafo="2000562339";visitas=82;cod100=7;cod200=0;cod300=5;clandestino=0;inclusao=0;exclusao=0;ip=0;observacoes="TRAFO EM ANDAMENTO";status="em_andamento"},
  @{data="2026-01-29";prospector="TUC801";polo="Tucuruí";prefixo="TUC801";trafo="2000567034";visitas=91;cod100=6;cod200=6;cod300=7;clandestino=0;inclusao=0;exclusao=0;ip=0;observacoes="TRAFO EM ANDAMENTO";status="em_andamento"},
  @{data="2026-01-29";prospector="PAP801";polo="Parauapebas";prefixo="PAP801";trafo="2000463541";visitas=45;cod100=1;cod200=0;cod300=0;clandestino=0;inclusao=5;exclusao=0;ip=12;observacoes="TRAFO FINALIZADO";status="executado"},
  @{data="2026-01-29";prospector="PAP801";polo="Parauapebas";prefixo="PAP801";trafo="2000475611";visitas=40;cod100=1;cod200=0;cod300=0;clandestino=0;inclusao=0;exclusao=0;ip=0;observacoes="TRAFO EM ANDAMENTO";status="em_andamento"},
  @{data="2026-01-29";prospector="MAB807";polo="Marabá";prefixo="MAB807";trafo="2000438747";visitas=86;cod100=5;cod200=0;cod300=9;clandestino=0;inclusao=6;exclusao=0;ip=15;observacoes="TRAFO CONCLUIDO";status="executado"},
  @{data="2026-01-29";prospector="PAP802";polo="Parauapebas";prefixo="PAP802";trafo="2000483080";visitas=80;cod100=1;cod200=0;cod300=0;clandestino=0;inclusao=0;exclusao=0;ip=0;observacoes="trafo falta finalizar";status="em_andamento"},
  @{data="2026-01-28";prospector="PAP802";polo="Parauapebas";prefixo="PAP802";trafo="2000478204";visitas=95;cod100=11;cod200=0;cod300=0;clandestino=0;inclusao=0;exclusao=0;ip=27;observacoes="trafo finalizado";status="executado"},
  @{data="2026-01-29";prospector="RED801";polo="Redenção";prefixo="RED801";trafo="2000609998";visitas=85;cod100=0;cod200=0;cod300=0;clandestino=0;inclusao=1;exclusao=2;ip=21;observacoes="trafo executado";status="executado"}
)

Write-Host "Inserindo registros de produtividade..." -ForegroundColor Cyan
Write-Host ""

foreach ($r in $registros) {
  $json = $r | ConvertTo-Json -Compress
  Write-Host "Enviando: $($r.prospector) - $($r.trafo)..." -NoNewline
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/registros" -Method POST -Body $json -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    Write-Host " OK!" -ForegroundColor Green
  } catch {
    Write-Host " ERRO: $($_.Exception.Message)" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Todos os registros foram processados!" -ForegroundColor Cyan
