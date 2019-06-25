// vim: ts=4 sw=4

const $qs = document.querySelector.bind(document)
const $qsAll = document.querySelectorAll.bind(document)

var keyNeighbours = {
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

function randomElementFromArray(xs) {
    return xs[Math.floor(Math.random() * xs.length)]
}

// drunkednessPercentage = [0.00;1.00]
function remap(useDigits, usePunct, symbol) {
    return randomElementFromArray(
        keyNeighbours[symbol].split('').filter(s =>
            (useDigits || !s.match(/[0-9]/)) && (usePunct || !s.match(/[^a-z]/))
        ))
}

function typoText(drunkPercent, useDigits, usePunct, text) {
    return text.split("").map(function(symbol) {
        if (symbol.match(/[a-z]/i) && Math.random() < drunkPercent) {
            mapped = remap(useDigits, usePunct, symbol.toLowerCase())
            return symbol == symbol.toLowerCase() ? mapped : mapped.toUpperCase()
        } else {
            return symbol
        }
    }).join("")
}

function render() {
    var input = $qs("#inputText")
    var output = $qs("#outputText")
    var drunkednessPercentage = parseInt($qs("#drunkednessPercentage").value) / 100
    var useDigits = $qs("#useDigits").checked
    var usePunct = $qs("#usePunct").checked

    output.textContent = typoText(drunkednessPercentage, useDigits, usePunct, input.value)
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

const setSlider = value => {
    const slider = $qs("#drunkednessPercentage")
    slider.value = value
    slider.dispatchEvent(new Event('change'))
}
