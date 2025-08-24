export function toInputValue(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    // HTML datetime-local format (no seconds, no Z)
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

export function toIso(value: string) {
    // value is local "YYYY-MM-DDTHH:MM"; Date will interpret as local time
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
}