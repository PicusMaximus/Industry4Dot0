function saveSettings() {
    const settingLeitstelle = document.getElementById('settings-leitstelle-adresse');
    const settingDobotName = document.getElementById('settings-dobot-name');
    
    const monitorIP = settingLeitstelle.value;
    const deviceName = settingDobotName.value;

    fetch(`/api/device/setSettings?monitorIP=${monitorIP}?deviceName=${deviceName}`, { method: 'POST' })
}