export const removeFirst = arr => Array.isArray(arr) ? arr.slice(1, arr.length) : false

export const compareArrays = (a = false, b = false, enforceOrder = true, enforceCasing = true) => {
    const options = !enforceCasing ? "i" : ""
    const includesByCasing = (arr, val) => new RegExp(arr.join("|"), options).test(val);
    const caseSensitiveEq = (val1, val2) => val1 === val2
    const caseInSensitiveEq = (val1, val2) => val1.toLowerCase() === val2.toLowerCase()
    const eqStringsByCasing = enforceCasing ? caseSensitiveEq : caseInSensitiveEq

    return (Array.isArray(a) && Array.isArray(b)) &&
        (a.length === b.length) &&
        (a.every((curr, i) => {
            if (typeof curr === 'string') {
                return enforceOrder ? eqStringsByCasing(curr, b[i]) : includesByCasing(b, curr)
            } else if (typeof curr === 'number') {
                return enforceOrder ? curr === b[i] : includesByCasing(b, curr)
            } else return false
        }))
}