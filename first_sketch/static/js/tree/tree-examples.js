
function node(value, ...children) {
    return {
        value: value,
        children: [...children]
    }
}

function biNode(value, left, right) {
    return {
        value: value,
        left: left,
        right: right
    }
}





/*
const root = {
    value: "A",
    children: []
}

const B = {
    value: "B",
    children: []
}

const C = {
    value = "C",
    children: []
}

const D = {
    value: "D",
    children: []
}

const E = {
    value: "E",
    children: []
}

const F = {
    value: "F",
    children: []
}

const G = {
    value: "G",
    children: []
}

const I = {
    value: "I",
    children: []
}

const J = {
    value: "J",
    children: []
}*/

const TreeExample = {
    tree1: {
    value: "A",
    children: [
        {
            value: "B",
            children: [
                {
                    value: "C",
                    children: []
                },
                {
                    value: "D",
                    children: []
                }
            ]
        },
        {
            value: "E",
            children: []
        }, 
        {
            value: "F",
            children: [
                {
                    value: "G",
                    children: []
                }
            ]
        }
    ]
},

tree2:  node("A", 
            node("B", 
                node("E"), 
                node("F")
            ), 
            node("C"), 
            node("D"),
    ),
tree3: node("A",
        node("B",
            node("G"),
            node("H",
                node("O"),
                node("P"),
                node("Q",
                    node("U"),
                    node("V"),
                    node("W")
                ),
            ),
            node("I",
                node("R"),
                node("S"),
                node("T")
            )
        ),
        node("C",
            node("J",
                node("X")
            ),
            node("K"),
            node("L",
                node("Y"),
                node("Z")
            )
        ),
        node("D"),
        node("E"),
        node("F",
            node("M"),
            node("N"))
),

binaryTree1: {
    value: "A",
    left: {
        value: "B",
        left: {
            value: "C"
        },
        right: {
            value: "D",
            right: {
                value: "E"
            }
        }
    },
    right: {
        value: "F",
        left: {
            value: "G",
            left: {
                value: "H"
            }
        }, 
        right: {
            value: "I"
        }
    }
},

binaryTree2: {
    value: "A",
    left: {
        value: "B",
        right: {
            value: "E",
            right: {
                value: "D",
                right: {
                    value: "G"
                }
            }
        }
    },
    right: {
        value: "C",
        left: {
            value: "F",
            left: {
                value: "H",
                left: {
                    value: "I",
                    left: {
                        value: "K"
                    }
                }
            }
        }
    }
},

binaryTree3: {
    value: "A",
    left: {
        value: "B",
        left: {
            value: "D"
        },
        right: {
            value: "E"
        }
    },
    right: {
        value: "C"
    }
},

binaryTree4: {
    value: "A",
    right: {
        value: "B",
        right: {
            value: "C",
            right: {
                value: "D"
            }
        }
    }
},

binaryTree5: {
    value: "A",
    left: {
        value: "B",
        right: {
            value: "D",
            left: {
                value: "E"
            },
            right: {
                value: "F"
            }
        }
    },
    right: {
        value: "C",
        left: {
            value: "G"
        },
        right: {
            value: "H",
            left: {
                value: "I"
            },
            right: {
                value: "J"
            }
        }
    }
},

binaryTree6:  
biNode("A", 
    biNode("B", 
        biNode("D"), 
        biNode("E",
            undefined,
            biNode("I",
                undefined,
                biNode("J")
            )
        )
    ), 
    biNode("C", 
        undefined, 
        biNode("F",
            biNode("G",
                biNode("H")
            )
        )
    )
)
}