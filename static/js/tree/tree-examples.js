const TreeExample = {
    tree: {
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
}}