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

function isLetter(letter) {
    // Probably doesn't work for cyrillic and latvian
    return letter.length === 1 && letter.match(/[a-z]/i)
}

function isNormalInteger(str) {
    return /^\+?\d+$/.test(str)
}

// drunkednessPercentage = [0.00;1.00]
function typoSymbol(drunkednessPercentage, digitsInTypos, symbol) {
    if (isLetter(symbol) && Math.round(Math.random() + (drunkednessPercentage - 0.5)) >= 1) {
        var availableTypos = keyNeighbours[symbol]

        if (digitsInTypos !== true) {
            for (var availableTypoKey in availableTypos) {
                if (isNormalInteger(availableTypos[availableTypoKey])) {
                    availableTypos.splice(availableTypoKey, 1)
                }
            }
        }

        return randomElementFromArray(availableTypos)
    }

    return symbol
}

function typoText(drunkednessPercentage, digitsInTypos, text) {
    return text.split("").map(function(symbol) {
        return typoSymbol(drunkednessPercentage, digitsInTypos, symbol)
    }).join("")
}

function render() {
    var input = document.getElementById("inputText")
    var output = document.getElementById("outputText")
    var drunkednessPercentage = parseInt(document.getElementById("drunkednessPercentage").value) / 100
    var digitsInTypos = document.getElementById("digitsInTypos").checked

    output.textContent = typoText(drunkednessPercentage, digitsInTypos, input.value.toLowerCase())
}

document.addEventListener("DOMContentLoaded", function(){
    var inputs = document.getElementsByTagName("input")
    for (node of inputs) {
        node.addEventListener('change', function() {
            render()
        })
    }

    var textareas = document.getElementsByTagName("textarea")
    for (node of textareas) {
        node.addEventListener('input', function() {
            render()
        })
    }

    var buttons = document.getElementsByTagName("button")
    for (node of buttons) {
        node.addEventListener('click', function() {
            render()
        })
    }
})

function setDrunkednessPercentage(percentage) {
    document.getElementById("drunkednessPercentage").value = percentage
    render()
}