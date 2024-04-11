function saveSettings() {
    const settingLeitstelle = document.getElementById('settings-leitstelle-adresse');
    const settingDobotName = document.getElementById('settings-dobot-name');
    
    const leitstelle = settingLeitstelle.value;
    const dobotName = settingDobotName.value;

    fetch('URL', { method: 'POST' })
}