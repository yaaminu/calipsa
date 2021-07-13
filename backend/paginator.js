
function paginate(items, { page = 1, page_size = 10, no_page }) {
    if (no_page) return { results: items }
    return {
        count: items.length,
        page: page,
        page_size: page_size,
        results: _next_page(items, page, page_size)
    }
}

function _next_page(items, curr_page, page_size) {
    let start = page_size * (curr_page - 1)
    return items.slice(start, start + page_size)
}

exports.paginate = paginate
