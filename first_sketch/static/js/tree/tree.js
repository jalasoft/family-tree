
const BinaryTree = (function() {

    function normalizeTreeRec(node, new_node = {}, height = 0) {
        new_node.value = node.value;
        new_node.height = height;

        let h1 = height;
        let h2 = height;

        if (node.left) {
            new_node.left = {
                parent: new_node
            }
            h1 = normalizeTreeRec(node.left, new_node.left, height+1).height;
        }

        if (node.right) {
            new_node.right = {
                parent: new_node
            };
            h2 = normalizeTreeRec(node.right, new_node.right, height+1).height;
        }

        return {
            height: Math.max(h1, h2),
            root: new_node
        }
    }

    function normalizeTreeIter(root) {

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
        const new_root = normalizeTreeIter(root);
        dfsWalk(new_root, {
            pre: cb,
            in: Function.prototype,
            post: Function.prototype
        });
    }
    
    function dfsInOrderIter(root, cb) {
        const new_root = normalizeTreeIter(root);
        dfsWalk(new_root, {
            pre: Function.prototype,
            in: cb,
            post: Function.prototype
        });
    }
    
    function dfsPostOrderIter(root, cb) {
        const new_root = normalizeTreeIter(root);
        dfsWalk(new_root, {
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

    function dfsPreOrderRec(node, cb, height = 0) {
        cb(node, height);

        if (node.left) dfsPreOrderRec(node.left, cb, height+1);
        if (node.right) dfsPreOrderRec(node.right, cb, height+1);
    }

    function dfsInOrderRec(node, cb, height = 0) {
        if (node.left) dfsInOrderRec(node.left, cb, height+1);
    
        cb(node, height);

        if (node.right) dfsInOrderRec(node.right, cb, height+1);
    }

    function dfsPostOrderRec(node, cb, height = 0) {
        if (node.left) dfsPostOrderRec(node.left, cb, height+1);
        if (node.right) dfsPostOrderRec(node.right, cb, height+1);

        cb(node, height);
    }

    return {
        strategy: "recursion",

        normalize: function(node) {
            const tree = normalizeTreeRec(node);
            tree.height += 1;
            return tree;
        },
        dfsInOrder: function(node, cb) {
            if (this.strategy === "iteration") {
                dfsInOrderIter(node, cb);
            } else if (this.strategy === "recursion") {
                dfsInOrderRec(node, cb);
            } else {
                throw new Error("Only 'recursion' or 'iteration' can be set a strategy");
            }
        },

        dfsPreOrder: function(node, cb) {
            if (this.strategy === "iteration") {
                dfsPreOrderIter(node, cb);
            } else if (this.strategy === "recursion") {
                dfsPreOrderRec(node, cb);
            } else {
                throw new Error("Only 'recursion' or 'iteration' can be set a strategy");
            }
        },

        dfsPostOrder: function(node, cb) {
            if (this.strategy === "iteration") {
                dfsPostOrderIter(node, cb);
            } else if (this.strategy === "recursion") {
                dfsPostOrderRec(node, cb);
            } else {
                throw new Error("Only 'recursion' or 'iteration' can be set a strategy");
            }
        }
    }
})();

const Tree = (function() {
    function normalizeTreeIter(root) {

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
        return { root: newRoot, height: maxHeight}
    }

    function dfsPreOrderRec(node, cb, height = 0) {
        cb(node, height);
        node.children.forEach(ch => dfsPreOrderRec(ch, cb, height+1));
    } 

    function dfsPostOrderRec(node, cb, height = 0) {
        node.children.forEach(ch => dfsPostOrderRec(ch, cb, height+1));
        cb(node, height);
    }

    function dfsPreOrderIter(node, cb) {
        walkTreeIter(node, {
            pre: cb,
            post: Function.prototype
        });
    }

    function dfsPostOrderIter(node, cb) {
        walkTreeIter(node, {
            pre: Function.prototype,
            post: cb
        });
    }

    function walkTreeIter(node, cb) {
    
        let current = node;
        let height = 0;

        while(current) {

            if (!current._) {
                current._ = {
                    status: -1
                }
            }

            if (current._.status < 0) {
                cb.pre(current, height);
                current._.status = 0;
            } else if (current._.status < current.children.length) {
                const child = current.children[current._.status];
                current._.status++;
                height++;
                current = child;
            } else {
                cb.post(current, height);
                delete current._;
                height--;
                current = current.parent;
            }
        }
    }

    return {
        strategy: "recursion",
        normalize: function(root) {
            return normalizeTreeIter(root);
        },
        dfsPreOrder: function(root, cb) {
            if (this.strategy === "recursion") {
                dfsPreOrderRec(root, cb);
            } else if (this.strategy === "iteration") {
                dfsPreOrderIter(root, cb);
            } else {
                throw new Error("Only 'recursion' or 'iteration' can be set a strategy");
            }
        },
        dfsPostOrder: function(root, cb) {
            if (this.strategy === "recursion") {
                dfsPostOrderRec(root, cb);
            } else if (this.strategy === "iteration") {
                dfsPostOrderIter(root, cb);
            } else {
                throw new Error("Only 'recursion' or 'iteration' can be set a strategy");
            }
        }
    }
})();