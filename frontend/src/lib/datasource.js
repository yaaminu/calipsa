export async function fetchAlarms({ page = 1, page_size = 10 }) {
    let res = await fetch(`http://localhost:8000/alarms/?page=${page}&page_size=${page_size}`, {
        headers: { 'Authorization': `Basic ${btoa("admin:s3cr3te")}` },
        method: 'GET'
    })
    if (res.status == 200) {
        return res.json()
    }
    throw new Error(`Unable to fetch alarms. Server returned ${res.text()}`)
}
