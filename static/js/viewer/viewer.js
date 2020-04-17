const Viewer = () => {}


Viewer.embelish = (function() {

    function onMouseUp() {
        this.isGrabbing = false;
        this.root.style.cursor = 'grab';
    }

    function onMouseDown() {
        this.isGrabbing = true;
        this.root.style.cursor = 'grabbing';
    }

    function onMouseLeave() {
        this.isGrabbing = false;
    }

    function onMouseMove(e) {
        if (!this.isGrabbing) {
            return;
        }

        const x = this.newRoot.scrollLeft - e.movementX;
        const y = this.newRoot.scrollTop - e.movementY;

        this.newRoot.scroll(x, y);
    }

    function replaceRootWithNewOne(root, newRoot) {
        const sibling = root.nextSibling;
        const parent = root.parentNode;
        parent.removeChild(root);

        if (sibling) {
            parent.insertBefore(newRoot, sibling);
        } else {
            parent.appendChild(newRoot);
        }
        newRoot.appendChild(root);
    }

    return function(selector) {    
        if (typeof selector !== "string") {
            throw new Error("Only string can be accepted as a selector.");
        }

        const root = document.querySelector(selector);
        
        const newRoot = document.createElement("div");
        newRoot.style.overflow = "auto";

        replaceRootWithNewOne(root, newRoot);
        
        const state = {
            isGrabbing: false,
            root: root,
            newRoot: newRoot
        };

        root.addEventListener('mouseup', onMouseUp.bind(state));
        root.addEventListener('mousedown', onMouseDown.bind(state));
        root.addEventListener('mousemove', onMouseMove.bind(state));
        root.addEventListener('mouseleave', onMouseLeave.bind(state));

        const pencil = new SVGPencil({
            width: 100,
            height: 100,
        });

        pencil.circle({
            cx: 50,
            cy: 50,
            r: 50
        });

        pencil.el.style.position = "sticky";
        pencil.el.style.top = "40px";
        pencil.el.style.left = "40px";
        pencil.el.style.zIndex = 2;

        newRoot.appendChild(pencil.el);
    }
})();


Object.freeze(Viewer);

