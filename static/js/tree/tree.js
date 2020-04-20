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
}



console.log(JSON.stringify(tree, null, 3));
update(tree);
console.log("fff");
//console.log(JSON.stringify(tree, null, 3));