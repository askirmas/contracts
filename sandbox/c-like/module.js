/** @typedef {import("./module").tFunc} tFunc */

/** @type {tFunc} */
const arrowFn = (param) => param.trim()

export {
    arrowFn,
    func
}

/** @param {Parameters<tFunc>[0]} param
 * @returns {ReturnType<tFunc>} */
function func(param) {
    return param.trim()
}