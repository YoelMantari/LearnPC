param([ValidateSet('Configurar','Mostrar','Quitar')][string]$Modo='Configurar')
$ErrorActionPreference='Stop'
$nombre='AlgoRecall-Web-Recordatorio'
if($Modo -eq 'Quitar'){Unregister-ScheduledTask -TaskName $nombre -Confirm:$false;return}
if($Modo -eq 'Mostrar'){
    $cantidad=& node (Join-Path $PSScriptRoot 'backend\recordatorio.mjs')
    if($LASTEXITCODE -eq 0 -and [int]$cantidad -gt 0){
        Add-Type -AssemblyName System.Windows.Forms
        $r=[Windows.Forms.MessageBox]::Show("Tu plan de hoy tiene $cantidad problemas. Abrir AlgoRecall?",'AlgoRecall','YesNo')
        if($r -eq 'Yes'){& (Join-Path $PSScriptRoot 'iniciar.ps1')}
    }
    return
}
$hora=Read-Host 'Hora diaria en formato HH:mm (por ejemplo 09:00)'
$momento=[DateTime]::ParseExact($hora,'HH:mm',[Globalization.CultureInfo]::InvariantCulture)
$accion=New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "'+$PSCommandPath+'" -Modo Mostrar')
Register-ScheduledTask -TaskName $nombre -Action $accion -Trigger (New-ScheduledTaskTrigger -Daily -At $momento) -User ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -RunLevel Limited -Settings (New-ScheduledTaskSettingsSet -StartWhenAvailable) -Force | Out-Null
Write-Host "Recordatorio configurado para las $hora."
