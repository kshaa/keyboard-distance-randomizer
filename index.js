// vim: ts=4 sw=4

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
function remap(digitsInTypos, symbol) {
    return randomElementFromArray(
        keyNeighbours[symbol].filter(s =>
            digitsInTypos || !s.match(/[0-9]/)))
}

function typoText(drunkPercent, digitsInTypos, text) {
    return text.split("").map(function(symbol) {
        if (symbol.match(/[a-z]/i) && Math.random() < drunkPercent) {
            mapped = remap(digitsInTypos, symbol.toLowerCase())
            return symbol == symbol.toLowerCase() ? mapped : mapped.toUpperCase()
        } else {
            return symbol
        }
    }).join("")
}

function render() {
    var input = document.getElementById("inputText")
    var output = document.getElementById("outputText")
    var drunkednessPercentage = parseInt(document.getElementById("drunkednessPercentage").value) / 100
    var digitsInTypos = document.getElementById("digitsInTypos").checked

    output.textContent = typoText(drunkednessPercentage, digitsInTypos, input.value)
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input, textarea, button').forEach(function (node) {
        node.addEventListener('change', render)
        node.addEventListener('keyup', render)
    })

    document.querySelectorAll('input[type=range]').forEach(function (node) {
        var state = 'up'

        node.addEventListener('mousedown', function () { state = 'down' })
        node.addEventListener('mouseup', function () { state = 'up' })
        node.addEventListener('mousemove', function () {
            if (state == 'down') {
                render()
            }
        })
    })
})

const setSlider = value => {
    const slider = document.getElementById("drunkednessPercentage")
    slider.value = value
    slider.dispatchEvent(new Event('change'))
}
