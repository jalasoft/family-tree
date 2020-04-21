const tree = {
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
}

const binaryTree = {
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
}

//-----------------------------------------------------------------------------
//BINARY TREE

function normalizeBinaryTreeRec(root) {
    const new_root = {};
    normalize(root, new_root);
    return new_root;
}

function normalize(node, new_node) {
    new_node.value = node.value;

    if (node.left) {
        new_node.left = {
            parent: new_node
        }
        normalize(node.left, new_node.left);
    }

    if (node.right) {
        new_node.right = {
            parent: new_node
        };
        normalize(node.right, new_node.right);
    }
}

function normalizeBinaryTreeIter(root) {

    const stack = [];
    stack.push(root);

    const new_stack = [];
    const new_root = {};
    new_stack.push(new_root);

    while(stack.length > 0) {
        const current = stack.pop();
        
        const new_current = new_stack.pop();
        new_current.value = current.value;

        if (current.right) {
            stack.push(current.right);
            
            new_current.right = {
                parent: new_current
            }
            new_stack.push(new_current.right);
        }
        
        if (current.left) {
            stack.push(current.left);
            
            new_current.left = {
                parent: new_current
            }
            new_stack.push(new_current.left);
        }
    }
    return new_root;
}

function dfsPreOrderIter(root, cb) {
    dfsWalk(root, {
        pre: cb,
        in: Function.prototype,
        post: Function.prototype
    });
}

function dfsInOrderIter(root, cb) {
    dfsWalk(root, {
        pre: Function.prototype,
        in: cb,
        post: Function.prototype
    });
}

function dfsPostOrderIter(root, cb) {
    dfsWalk(root, {
        pre: Function.prototype,
        in: Function.prototype,
        post: cb
    });
}

function dfsWalk(root, handler) {

    let current = root;
    
    while(current) {
        if (!current._) current._ = { status: 0}

        switch(current._.status) {
            case 0:
                handler.pre(current);
                current._.status = 1;
                if (current.left) {
                    current = current.left;
                }
                break;

            case 1:
                handler.in(current);
                current._.status = 2;
                if (current.right) {
                    current = current.right;
                }
                break;

            case 2:
                handler.post(current);
                delete current._;
                current = current.parent;
                break;
        }
    }
}

function dfsPreOrderRec(root, cb) {
    
    cb(root);

    if (root.left) {
        dfsPreOrderRec(root.left, cb);
    }
    if (root.right) {
        dfsPreOrderRec(root.right, cb);
    }
}


function dfsInOrderRec(root, cb) {
    if (root.left) {
        dfsInOrderRec(root.left, cb);
    }
    
    cb(root);

    if (root.right) {
        dfsInOrderRec(root.right, cb);
    }
}

function dfsPostOrderRec(root, cb) {
    if (root.left) {
        dfsPostOrderRec(root.left, cb);
    }
    if (root.right) {
        dfsPostOrderRec(root.right, cb);
    }

    cb(root);
}


//----------------------------------------------------------------------------
//GENERIC TREE

function normalizeTree(root) {

    const stack = [];
    const newStack = [];
    let maxHeight = 0;

    const newRoot = {
        value: root.value,
        children: [],
        parent: undefined,
        height: 0
    }

    stack.push(root);
    newStack.push(newRoot);

    while(stack.length > 0) {
        const current = stack.pop();
        const newCurrent = newStack.pop();

        current.children.forEach(n => {
            const height = newCurrent.height+1;
            maxHeight = Math.max(maxHeight, height);
            const newNode = {
                value: n.value,
                parent: newCurrent,
                children: [],
                height: height
            }

            stack.push(n);
            newStack.push(newNode);
            newCurrent.children.push(newNode);
        });
    }
    return { root: newRoot, maxHeight: maxHeight}
}
/*
function dfsWalk(root, cb) {
    const stack = [];
    stack.push(root);

    while(stack.length > 0) {
        const node = stack.pop();
        cb(node);
        node.children.reverse().forEach(ch => stack.push(ch));
    }
}*/



function simplyTidyDrawedTree(root, height) {

    const offsetX = 100;
    const offsetY = 100;
    const nodeWidth = 25;
    const nodeHeight = 25;
    const hspace = 10;
    const vspace = 10;

    const x_pos = Array(height+1).fill(offsetX);
    
    dfsWalk(root, node => {
        node.coord = {
            y: offsetY + node.height * (nodeHeight + vspace),
            x: x_pos[node.height],
            width: nodeWidth,
            height: nodeHeight
        };

        x_pos[node.height] += nodeWidth + hspace;
    
    });
}


function drawTree(root, containerSelector) {
    const pencil = new SVGPencil({
        width: 1200,
        height: 700,
    });

    dfsWalk(root, node => {
        const c1 = node.coord;
        pencil.rectangle({
            x: c1.x,
            y: c1.y,
            width: c1.width,
            height: c1.height,
            fill: 'green',
            stroke: '1px'
        });

        if (!node.parent) {
            return;
        }

        const c2 = node.parent.coord;

        pencil.line({
            x1: c1.x + (c1.width/2),
            y1: c1.y,
            x2: c2.x + (c2.width/2),
            y2: c2.y + c2.height,
            stroke: 'green'
        });
    });

    const container = document.querySelector(containerSelector);
    container.appendChild(pencil.el);
}

/*
function update(root) {

    let current = root;
    let parent;
    let height = 0;

    while(current) {
        if (!current.__intern) {
            current.__intern = {};
            current.__intern.status = 0;
            current.__intern.parent = parent;
            current.__intern.height = height;
        }
        if (!current.children) current.children = Array.prototype;

        if (current.__intern.status < current.children.length) {
            height++;
            parent = current;
            current = current.children[current.__intern.status];
            parent.__intern.status++;
        } else {
            height--;
            current = current.__intern.parent;
        }
    }
}*/

console.log(JSON.stringify(binaryTree, null, 3));

(function() {
    console.log("------ITERATOR---------------")
    const normalized = normalizeBinaryTreeIter(binaryTree);
    console.log("-----PRE ORDER-----");
    dfsPreOrderIter(normalized, node => console.log(node.value));
    console.log('----IN ORDER----');
    dfsInOrderIter(normalized, node => console.log(node.value));
    console.log('----POST ORDER----');
    dfsPostOrderIter(normalized, node => console.log(node.value));
})();


(function() {
    console.log("------RECURSION---------------")
    const normalized = normalizeBinaryTreeRec(binaryTree);
    console.log("-----PRE ORDER-----");
    dfsPreOrderRec(normalized, node => console.log(node.value));
    console.log('----IN ORDER----');
    dfsInOrderRec(normalized, node => console.log(node.value));
    console.log('----POST ORDER----');
    dfsPostOrderRec(normalized, node => console.log(node.value));
})();

//dfsPostOrder(normalized, node => console.log(node.value));

/*
const newTree = normalizeTree(tree);
simplyTidyDrawedTree(newTree.root, newTree.maxHeight);

Viewer.embelish('#svg-container', {
    zoomIncrement: 0.2
});

drawTree(newTree.root, '#svg-container');
*/
