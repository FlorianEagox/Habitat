export function formatFloatToDuration(value) {
    if (value === undefined || value === null || value === '' || value === false) return '';
    
    const totalMinutes = Math.round(parseFloat(value) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // Pad minutes with a leading zero (e.g., "05")
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Converts a user UI string like "1:30" into a database float 1.5
export function parseDurationToFloat(stringValue) {
    if (!stringValue || !stringValue.includes(':')) return 0;
    
    const [hoursStr, minutesStr] = stringValue.split(':');
    const hours = parseInt(hoursStr, 10) || 0;
    const minutes = parseInt(minutesStr, 10) || 0;
    
    // Convert minute fraction to decimal hours cleanly (e.g., 30 mins / 60 = 0.5)
    return parseFloat((hours + minutes / 60).toFixed(2));
}
