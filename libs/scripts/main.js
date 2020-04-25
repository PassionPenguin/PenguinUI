(() => {
    Element.prototype.bcr = function () {
        return this.getBoundingClientRect();
    };
    Element.prototype.fadeIn = function (displayMode, visibility) {
        this.style.opacity = "1";
        this.style.display = displayMode || "unset";
        this.style.visibility = visibility || "visible";
        this.style.transition += " opacity 500ms ease-in-out";
    };
    Element.prototype.fadeOut = function (remove) {
        this.style.opacity = "0";
        setTimeout(() => {
            this.style.display = "none";
            if (remove)
                this.parentElement.removeChild(this);
        }, 500);
    };
    Element.prototype.on = window.on = function (types, func, options) {
        if (!(types || func)) {
            return;
        }
        options = options || {};
        types = Array.isArray(types) ? types : [types];
        types.forEach(type => {
            this.addEventListener(type, func, options);
        });
    }

    const init = (mutationRecord) => {
        let changedInf = [], attrList = ["ripple", "data-role", "data-toggle", "data-dismissible", "data-target"];
        if (mutationRecord.type === "attributes" && attrList.indexOf(mutationRecord.attributeName) !== -1)
            changedInf.push([mutationRecord.target, mutationRecord.attributeName]);

        else if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0)
            mutationRecord.addedNodes.forEach(node => {
                let state = false, list = [];
                attrList.forEach(attr => {
                    if (node.attributes[attr] !== undefined) {
                        state = true;
                        list.push(attr);
                    }
                });
                if (state)
                    changedInf.push([node, list]);

            });
        if (changedInf.length > 0)
            changedInf.forEach(detail => {
                if (detail[1].indexOf("ripple") !== -1 && detail[0].attributes["ripple"] !== "false") {
                    let rippleContainer,
                        ripple = detail[0], addRipple = function (e) {
                            let ripple = this,
                                size = ripple.offsetWidth,
                                pos = () => {
                                    return ripple.getBoundingClientRect();
                                },
                                rippler = document.createElement('span'),
                                x = e.clientX - pos().left - (size / 2),
                                y = e.clientY - pos().top - (size / 2),
                                style = 'top:' + y + 'px; left:' + x + 'px; height: '
                                    + size + 'px; width: ' + size + 'px;';
                            ripple.rippleContainer.appendChild(rippler);
                            rippler.setAttribute('style', style);
                        }, cleanUp = function () {
                            let container = this.rippleContainer;
                            if (container !== undefined)
                                container.removeChild(container.firstChild);
                        };
                    if(detail[0].attributes["ripple"]!=="false") {
                        rippleContainer = document.createElement('div');
                        rippleContainer.className = 'ripple--container';
                        ripple.addEventListener('mousedown', addRipple);
                        ripple.addEventListener('mouseup', () => setTimeout(cleanUp, 2000), {once: true});
                        ripple.rippleContainer = rippleContainer;
                        ripple.appendChild(rippleContainer);
                    }
                    else{
                        ripple.removeEventListener('mousedown', addRipple);
                        ripple.removeEventListener('mouseup', () => setTimeout(cleanUp, 2000), {once: true});

                    }
                }
            });
    };
    const mutationObserver = new MutationObserver(init);
    mutationObserver.observe(document.body, {subtree: true, childList: true, attributes: true});
    window.on("load", () => {
        init({type: "childList", addedNodes: document.querySelectorAll("*")});
    });
})();

const $ = ((selector, context) => {
    return [context && selector ? context.querySelectorAll(selector) : document];
})();