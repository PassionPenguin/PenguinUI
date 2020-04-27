(() => {
    const $ = (selector = "body", context = document) => {
        return context.querySelectorAll(selector);
    };
    const createElement = (data = {
        type: "div",
        ns: null,
        innerText: null,
        innerHTML: null,
        attr: [],
        onclick: null
    }) => {
        let el;
        if (data.ns)
            el = document.createElementNS(data.ns, data.type);
        else el = document.createElement(data.type);
        if (data.innerText)
            el.innerText = data.innerText;
        if (data.innerHTML)
            el.innerHTML = data.innerHTML;
        if (data.attr)
            data.attr.forEach(e => {
                el.setAttribute(e[0], e[1])
            });
        if (data.onclick)
            el.onclick = data.onclick;
        return el;
    };

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
    };
    Element.prototype.appendNewChild = function (data = {
        type: "div",
        ns: null,
        innerText: null,
        innerHTML: null,
        attr: [],
        onclick: null
    }) {
        let el = createElement(data);
        this.appendChild(el);
        return el;
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
        let changedInf = [],
            attrList = ["ripple", "data-toggle", "data-dismissible", "data-target", "href", "data-carousel", "data-position"];
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
                if (node.classList.contains("alert-dismissible") && list.indexOf("data-dismissible") === -1)
                    list.push("data-dismissible");
                if (node.classList.contains("carousel") && list.indexOf("data-carousel") === -1) list.push("data-carousel")
                if (list.length > 0)
                    changedInf.push([node, list]);
            });
        if (changedInf.length > 0)
            changedInf.forEach(detail => {
                if (detail[1].indexOf("ripple") !== -1 && detail[0].attributes["ripple"].value !== "false") {
                    let rippleContainer,
                        ripple = detail[0], cleanUp = function (rippler) {
                            rippler.remove();
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
                                cleanUp(rippler);
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
                if (detail[1].indexOf("data-dismissible") !== -1 && detail[0].querySelectorAll(".close").length === 0) {
                    let el = document.createElement("button");
                    el.classList.add("close");
                    el.innerText = "close";
                    el.on("click", () => {
                        detail[0].classList.add("fade-out");
                        setTimeout(() => {
                            detail[0].remove();
                        }, 500);
                    }, {once: true});
                    detail[0].appendChild(el);
                }
                if (detail[1].indexOf("data-carousel") !== -1) {
                    let curIndex = 0, prevIndex = 0, imgs = detail[0].querySelectorAll(".carousel-item");
                    const slide = (val) => {
                        if (parseInt(val) === curIndex)
                            return;
                        if (val === "prev" || parseInt(val) < curIndex) {
                            prevIndex = curIndex;
                            imgs[curIndex].classList.add("next");
                            imgs[curIndex].classList.remove("active");
                            curIndex = (val === "prev" ? curIndex === 0 ? (imgs.length - 1) : curIndex - 1 : parseInt(val));
                            imgs[curIndex].classList.add("prev");
                            imgs[curIndex].classList.add("active");
                            setTimeout(() => {
                                imgs[curIndex].classList.remove("prev");
                                imgs[prevIndex].classList.remove("next");
                            }, 500);
                        } else {
                            prevIndex = curIndex;
                            imgs[curIndex].classList.add("prev");
                            imgs[curIndex].classList.remove("active");
                            curIndex = (val === "next" ? curIndex === (imgs.length - 1) ? 0 : curIndex + 1 : parseInt(val));
                            imgs[curIndex].classList.add("next");
                            imgs[curIndex].classList.add("active");
                            setTimeout(() => {
                                imgs[curIndex].classList.remove("next");
                                imgs[prevIndex].classList.remove("prev");
                            }, 500);
                        }
                        indicators.children[prevIndex].classList.remove("active");
                        indicators.children[curIndex].classList.add("active");
                    };
                    let indicators = createElement({type: "div", attr: [["class", "carousel-indicators"]]});
                    for (let i = 0; i < imgs.length; i++)
                        indicators.appendNewChild({
                            type: "div", attr: [["class", "carousel-indicator"]], onclick: () => {
                                slide(i.toString());
                            }
                        });
                    indicators.children[0].classList.add("active");
                    detail[0].appendChild(indicators);
                    detail[0].appendNewChild({
                        type: "div",
                        attr: [["class", "carousel-prevIndicator"]],
                        innerHTML: "<span class='mi'>chevron_left</span>",
                        onclick: () => {
                            slide("prev");
                        }
                    });
                    detail[0].appendNewChild({
                        type: "div",
                        attr: [["class", "carousel-nextIndicator"]],
                        innerHTML: "<span class='mi'>chevron_right</span>",
                        onclick: () => {
                            slide("next");
                        }
                    });
                }
                if (detail[1].indexOf("data-toggle") !== -1 || detail[1].indexOf("data-target") !== -1) {
                    if (detail[0].getAttribute("data-toggle") === "collapse") {
                        let target = detail[0].link || detail[0].getAttribute("data-target");
                        target = $(target)[0];
                        if (target === undefined)
                            return;
                        target.classList.remove("collapse");
                        target.classList.add("collapse");
                        detail[0].onclick = () => {
                            if (target.style.maxHeight) {
                                target.style.maxHeight = null;
                            } else {
                                target.style.maxHeight = target.style.height || (target.scrollHeight + "px");
                            }
                        };
                    } else if (detail[0].getAttribute("data-toggle") === "dropdown") {
                        let target = detail[0].link || detail[0].getAttribute("data-target");
                        target = $(target)[0];
                        if (target === undefined)
                            return;
                        detail[0].onclick = (ev) => {
                            ev.stopPropagation();
                            let bcr = () => {
                                return detail[0].getBoundingClientRect();
                            };
                            target.style.left = `${bcr().x}px`;
                            target.style.top = `${bcr().y + bcr().height + 12}px`;
                            target.classList.toggle("show");
                            window.on("scroll", function () {
                                if (!target.classList.contains("show")) window.removeEventListener(this);
                                target.style.left = `${bcr().x}px`;
                                target.style.top = `${bcr().y + bcr().height + 12}px`;
                            });
                            window.on("click", () => {
                                target.classList.remove("show");
                            }, {once: true});
                        };
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