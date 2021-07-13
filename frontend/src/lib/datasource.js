export async function fetchAlarms() {
    let res = await fetch('http://localhost:8000/alarms/', {
        headers: { 'Authorization': `Basic ${btoa("admin:s3cr3te")}` },
        method: 'GET'
    })
    if (res.status == 200) {
        return res.json()
    }
    throw new Error(`Unable to fetch alarms. Server returned ${res.text()}`)
}
