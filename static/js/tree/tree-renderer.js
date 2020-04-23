function drawTree(root) {
    const pencil = new SVGPencil({
        width: 1200,
        height: 700,
    });

    BinaryTree.dfsPreOrder(root, n => {
        pencil.rectangle({
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
            fill: 'green',
            stroke: '1px'
        });
        
        pencil.text(n.value, {
            x: n.x + (n.width / 2),
            y: n.y + (n.height / 2),
            'text-anchor': 'middle',
            'alignment-baseline': 'central'
        });

        if (!n.parent) {
            return;
        }

        const p = n.parent;

        pencil.line({
            x1: n.x + (n.width/2),
            y1: n.y,
            x2: p.x + (p.width/2),
            y2: p.y + p.height,
            stroke: 'green'
        });


    });
    return pencil.el;
}