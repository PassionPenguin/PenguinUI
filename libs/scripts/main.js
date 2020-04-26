(() => {
    Element.prototype.bcr = function () {
        return this.getBoundingClientRect();
    };
    Element.prototype.fadeIn = function (displayMode = "unset", visibility = "visible") {
        this.style.opacity = "1";
        this.style.display = displayMode;
        this.style.visibility = visibility;
        this.style.transition += " opacity 500ms ease-in-out";
    };
    Element.prototype.fadeOut = function (remove = false) {
        this.style.opacity = "0";
        setTimeout(() => {
            this.style.display = "none";
            if (remove)
                this.parentElement.removeChild(this);
        }, 500);
    };
    Element.prototype.on = window.on = function (types, func, options = {}) {
        if (!(types || func)) {
            return;
        }
        types = Array.isArray(types) ? types : [types];
        types.forEach(type => {
            this.addEventListener(type, func, options);
        });
    }

    const init = (mutationRecord) => {
        /**
         * @param mutationRecord: Callback of MutationObserve
         *  => mutations: MutationRecord[]
         *      can be call in this function, type should be "childList".
         * @example init({type: "childList", addedNodes: document.body.querySelectorAll("*")});
         *
         * Init Elements, eg. initialized all HTMLButtonElements that [ripple] !== "false", initialized all toggles...
         */
        let changedInf = [], attrList = ["ripple", "data-role", "data-toggle", "data-dismissible", "data-target"];
        if (mutationRecord.type === "attributes" && attrList.indexOf(mutationRecord.attributeName) !== -1)
            changedInf.push([mutationRecord.target, mutationRecord.attributeName]);

        else if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0)
            mutationRecord.addedNodes.forEach(node => {
                let list = [];
                attrList.forEach(attr => {
                    if (node.attributes[attr] !== undefined) {
                        list.push(attr);
                    }
                });
                if (node.tagName === "button" && node.attributes["ripple"] && node.attributes["ripple"].value !== "false" && list.indexOf("ripple") === -1)
                    list.push("ripple");
                if (list.length > 0)
                    changedInf.push([node, list]);

            });
        if (changedInf.length > 0)
            changedInf.forEach(detail => {
                if (detail[1].indexOf("ripple") !== -1 && detail[0].attributes["ripple"].value !== "false") {
                    let rippleContainer,
                        ripple = detail[0], cleanUp = function (container, rippler) {
                            container.removeChild(rippler);
                        }, addRipple = function (e) {
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
                            ripple.addEventListener('mouseup', () => setTimeout(() => {
                                cleanUp(ripple.rippleContainer, rippler);
                            }, 2000), {once: true});
                        }
                    if (detail[0].attributes["ripple"] !== "false") {
                        rippleContainer = document.createElement('div');
                        rippleContainer.className = 'ripple--container';
                        ripple.addEventListener('mousedown', addRipple);
                        ripple.rippleContainer = rippleContainer;
                        ripple.appendChild(rippleContainer);
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

const $ = ((selector = "body", context = document) => {
    return context.querySelectorAll(selector);
})();