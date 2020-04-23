const TreeLayout = {
    
    simpleWetherelShannon: function(root, height) {

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
    },

    wetherellShannon: function(node, height, config = {}) {
        const gap = config.gap || 15;
        const node_width = config.node_width || 30;
        const node_half_width = node_width / 2;

        const offset = Array(height).fill(0);
        const next_pos = Array(height).fill(0);

        BinaryTree.dfsPostOrder(node, (node, height) => {

            let place;
            if (node.left && node.right) {
                place = (node.left.x + node.right.x) / 2;
            } else if (node.left) {
                place = node.left.x + node_half_width;
            } else if (node.right) {
                place = node.right.x - node_half_width;
            } else {
                place = next_pos[height];
            }
            
            offset[height] = Math.max(offset[height], next_pos[height] - place);

            if (!node.left && !node.right) {
                node.x = place;
            } else {
                node.x = place + offset[height];
            }

            node.y = height * (node_width + gap);

            node.width = node_width;
            node.height = node.width;

            node.offset = offset[height];
            //next_pos[height] += node_width + gap;
            next_pos[height] = place + node.width + gap + offset[height];
            
            //console.log(`${node.value}: x=${node.x}  y=${node.y}  offset=${node.offset}`);
        });

        function shiftSubtrees(node, sumOffset=0) {
            if (!node) {
                return;
            }

            node.x += sumOffset;
            sumOffset += node.offset;

            shiftSubtrees(node.left, sumOffset);
            shiftSubtrees(node.right, sumOffset);
        }

        shiftSubtrees(node);
    }
}