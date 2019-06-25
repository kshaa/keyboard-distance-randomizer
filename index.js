// vim: ts=4 sw=4

const $qs = document.querySelector.bind(document)
const $qsAll = document.querySelectorAll.bind(document)

var keyNeighbours = {
    "q": ["1", "2", "w", "s", "a", ],
    "w": ["1", "2", "3", "e", "d", "s", "a", "q", ],
    "e": ["2", "3", "4", "r", "f", "d", "s", "w", ],
    "r": ["3", "4", "5", "t", "g", "f", "d", "e", ],
    "t": ["4", "5", "6", "y", "h", "g", "f", "r", ],
    "y": ["5", "6", "7", "u", "j", "h", "g", "t", ],
    "u": ["6", "7", "8", "i", "k", "j", "h", "y", ],
    "i": ["7", "8", "9", "o", "l", "k", "j", "u", ],
    "o": ["8", "9", "0", "p", ";", "l", "k", "i", ],
    "p": ["9", "0", "-", "[", "'", ";", "l", "o", ],
    "a": ["q", "w", "s", "x", "z", ],
    "s": ["q", "w", "e", "d", "c", "x", "z", "a", ],
    "d": ["w", "e", "r", "f", "v", "c", "x", "s", ],
    "f": ["e", "r", "t", "g", "b", "v", "c", "d", ],
    "g": ["r", "t", "y", "h", "n", "b", "v", "f", ],
    "h": ["t", "y", "u", "j", "m", "n", "b", "g", ],
    "j": ["y", "u", "i", "k", ",", "m", "n", "h", ],
    "k": ["u", "i", "o", "l", ".", ",", "m", "j", ],
    "l": ["i", "o", "p", ";", "/", ".", ",", "k", ],
    "z": ["a", "s", "x", ],
    "x": ["z", "a", "s", "d", "c", ],
    "c": ["x", "s", "d", "f", "v", ],
    "v": ["c", "d", "f", "g", "b", ],
    "b": ["v", "f", "g", "h", "n", ],
    "n": ["b", "g", "h", "j", "m", ],
    "m": ["n", "h", "j", "k", ","],
}

function randomElementFromArray(xs) {
    return xs[Math.floor(Math.random() * xs.length)]
}

// drunkednessPercentage = [0.00;1.00]
function remap(useDigits, usePunct, symbol) {
    return randomElementFromArray(
        keyNeighbours[symbol].filter(s =>
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
