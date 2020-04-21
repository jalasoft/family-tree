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

    function onZoomIn() {
        this.zoomStatus += this.zoomIncrement;
        this.root.style.transformOrigin = "0 0";
        this.root.style.transform = `scale(${this.zoomStatus})`;
    }

    function onZoomOut() {
        this.zoomStatus -= this.zoomIncrement;
        this.root.style.transformOrigin = "0 0  ";
        this.root.style.transform = `scale(${this.zoomStatus})`;
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

    function newFixedButton(title, left, top) {
        const btn = document.createElement("button");
        btn.innerText = title;
        btn.style.position = "absolute";
        btn.style.top = `${top}px`;
        btn.style.left = `${left}px`;

        this.newRoot.addEventListener('scroll', e => {
            const floatedTop = this.newRoot.scrollTop + top;
            const floatedLeft = this.newRoot.scrollLeft + left;
            btn.style.top = `${floatedTop}px`;
            btn.style.left = `${floatedLeft}px`;
        });
        return btn;
    }

    //---------------------------------------------------------------------------

    return function(selector, config) {    
        if (typeof selector !== "string") {
            throw new Error("Only string can be accepted as a selector.");
        }

        const root = document.querySelector(selector);

        const newRoot = document.createElement("div");
        newRoot.style.overflow = "auto";
        newRoot.style.position = "relative";

        replaceRootWithNewOne(root, newRoot);
        
        const state = {
            isGrabbing: false,
            root: root,
            newRoot: newRoot,
            zoomStatus: 1,
            zoomIncrement: config && config.zoomIncrement ? config.zoomIncrement : 0.05
        };

        root.addEventListener('mouseup', onMouseUp.bind(state));
        root.addEventListener('mousedown', onMouseDown.bind(state));
        root.addEventListener('mousemove', onMouseMove.bind(state));
        root.addEventListener('mouseleave', onMouseLeave.bind(state));

        const zoomIn = newFixedButton.call(state, "+", 10, 10);
        zoomIn.addEventListener('click', onZoomIn.bind(state));

        const zoomOut = newFixedButton.call(state, "-", 40, 10);
        zoomOut.addEventListener('click', onZoomOut.bind(state));

        newRoot.appendChild(zoomIn);
        newRoot.appendChild(zoomOut);
    }
})();


Object.freeze(Viewer);

