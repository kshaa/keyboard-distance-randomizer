// vim: ts=4 sw=4

const isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined'
const isNode = typeof module !== 'undefined'

if (isBrowser) {
    var $qs = document.querySelector.bind(document)
    var $qsAll = document.querySelectorAll.bind(document)
}

var keyNeighboursDistant = {
    "q": "12wsa",
    "w": "123edsaq",
    "e": "234rfdsw",
    "r": "345tgfde",
    "t": "456yhgfr",
    "y": "567ujhgt",
    "u": "678ikjhy",
    "i": "789olkju",
    "o": "890p;lki",
    "p": "90-';lo",
    "a": "qwsxz",
    "s": "qwedcxza",
    "d": "werfvcxs",
    "f": "ertgbvcd",
    "g": "rtyhnbvf",
    "h": "tyujmnbg",
    "j": "yuikmnh,",
    "k": "uiol.mj,",
    "l": "iop;/.k,",
    "z": "asx",
    "x": "zasdc",
    "c": "xsdfv",
    "v": "cdfgb",
    "b": "vfghn",
    "n": "bghjm",
    "m": "nhjk,",
}

// on a mbp keyboard
var keyNeighboursClose = {
    "q": "1wa",
    "w": "23esq",
    "e": "34wrd",
    "r": "45tfe",
    "t": "56ygr",
    "y": "67uht",
    "u": "78ijy",
    "i": "89oku",
    "o": "90pli",
    "p": "0-[;o",
    "a": "qsz",
    "s": "awdxz",
    "d": "esxcf",
    "f": "rdcvg",
    "g": "tfvbh",
    "h": "ygbnj",
    "j": "uhnmk",
    "k": "ijm,l",
    "l": "ok,.;",
    "z": "`xas",
    "x": "zsdc",
    "c": "xdfv",
    "v": "cfgb",
    "b": "vghn",
    "n": "bhjm",
    "m": "njk,",
}

function randomElementFromArray(xs) {
    return xs[Math.floor(Math.random() * xs.length)]
}

function remap(useDigits, usePunct, forbiddenTypo, symbol) {
    return randomElementFromArray(
        keyNeighboursClose[symbol].split('').filter(s =>
            s != forbiddenTypo &&
            (
                (useDigits && s.match(/[0-9]/)) ||
                (usePunct && !s.match(/[a-z]/) && !s.match(/[0-9]/)) ||
                s.match(/[a-z]/)
            )
        ))
}

/**
 * Are symbols within proximity of each other?
 * E.g. 'e' and 'e' have proximity 0.
 *
 * Returns NaN or least jumps between symbols
 * I.e. falsy and truthy values
 */
function areSymbolsNearby(a, b, proximity) {
    let ans = keyNeighboursDistant[a] ?
        keyNeighboursDistant[a].split('') : null

    if (ans == null || proximity < 0)
        return NaN
    if (a == b)
        return 0
    else {
        // Attempt recursive BFS search from a through neighbours to b
        let proximities = ans
            .map(an => areSymbolsNearby(an, b, proximity - 1))
            .filter(prox => !isNaN(prox))

        if (proximities.length > 0)
            return 1 + Math.min.apply(null, proximities)
        else
            return NaN
    }
}

function typoText(drunkPercent, useDigits, usePunct, text) {
    return text.split(' ').map(word => {
        var count = 0

        var forbiddenTypo = null
        var previousSymbol = null
        var previousTypo = null

        return word.split('').map(function(symbol) {
            if (
                previousSymbol && previousTypo &&
                areSymbolsNearby(previousSymbol.toLowerCase(), symbol.toLowerCase(), 2)
            ) {
                forbiddenTypo = previousTypo.toLowerCase()
            } else {
                forbiddenTypo = null
            }

            if (
                count + Math.random() * 1.5 - 0.75 < Math.ceil(word.length / 6) &&
                symbol.match(/[a-z]/i) &&
                Math.random() < drunkPercent
            ) {
                count += 1
                mapped = remap(useDigits, usePunct, forbiddenTypo, symbol.toLowerCase())
                typo = symbol == symbol.toLowerCase() ? mapped : mapped.toUpperCase()

                previousSymbol = symbol
                previousTypo = typo

                return typo
            } else {
                previousSymbol = null
                previousTypo = null

                return symbol
            }
        }).join('')
    }).join(' ')
}

function render() {
    var input = $qs("#inputText")
    var output = $qs("#outputText")
    var drunkednessPercentage = parseInt($qs("#drunkednessPercentage").value) / 100
    var useDigits = $qs("#useDigits").checked
    var usePunct = $qs("#usePunct").checked

    output.textContent = typoText(drunkednessPercentage, useDigits, usePunct, input.value)
}

if (isNode) {
    module.exports = {
        areSymbolsNearby
    }
} else if (isBrowser) {
    window.setSlider = value => {
        const slider = $qs("#drunkednessPercentage")
        slider.value = value
        slider.dispatchEvent(new Event('change'))
    }

    document.addEventListener('DOMContentLoaded', function() {
        $qsAll('input, textarea, button').forEach(function (node) {
            node.addEventListener('change', render)
            node.addEventListener('keyup', render)
        })

        $qsAll('input[type=range]').forEach(function (node) {
            var state = 'up'

            node.addEventListener('mousedown', function () { state = 'down' })
            node.addEventListener('mouseup', function () { state = 'up' })
            node.addEventListener('mousemove', function () {
                if (state == 'down') {
                    render()
                }
            })
        })

        render()
    })
}