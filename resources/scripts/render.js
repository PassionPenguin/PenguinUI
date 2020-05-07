(() => {
    !function (e, n) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (e = e || self).hljs = n()
    }
    (this, (function () {
        "use strict";

        function e(n) {
            Object.freeze(n);
            var t = "function" == typeof n;
            return Object.getOwnPropertyNames(n).forEach((function (r) {
                !n.hasOwnProperty(r) || null === n[r] || "object" != typeof n[r] && "function" != typeof n[r] || t && ("caller" === r || "callee" === r || "arguments" === r) || Object.isFrozen(n[r]) || e(n[r])
            })), n
        }

        function n(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }

        function t(e) {
            var n, t = {}, r = Array.prototype.slice.call(arguments, 1);
            for (n in e) t[n] = e[n];
            return r.forEach((function (e) {
                for (n in e) t[n] = e[n]
            })), t
        }

        function r(e) {
            return e.nodeName.toLowerCase()
        }

        var a = Object.freeze({
            __proto__: null, escapeHTML: n, inherit: t, nodeStream: function (e) {
                var n = [];
                return function e(t, a) {
                    for (var i = t.firstChild; i; i = i.nextSibling) 3 === i.nodeType ? a += i.nodeValue.length : 1 === i.nodeType && (n.push({
                        event: "start",
                        offset: a,
                        node: i
                    }), a = e(i, a), r(i).match(/br|hr|img|input/) || n.push({
                        event: "stop",
                        offset: a,
                        node: i
                    }));
                    return a
                }(e, 0), n
            }, mergeStreams: function (e, t, a) {
                var i = 0, s = "", o = [];

                function l() {
                    return e.length && t.length ? e[0].offset !== t[0].offset ? e[0].offset < t[0].offset ? e : t : "start" === t[0].event ? e : t : e.length ? e : t
                }

                function c(e) {
                    s += "<" + r(e) + [].map.call(e.attributes, (function (e) {
                        return " " + e.nodeName + '="' + n(e.value).replace(/"/g, "&quot;") + '"'
                    })).join("") + ">"
                }

                function u(e) {
                    s += "</" + r(e) + ">"
                }

                function d(e) {
                    ("start" === e.event ? c : u)(e.node)
                }

                for (; e.length || t.length;) {
                    var g = l();
                    if (s += n(a.substring(i, g[0].offset)), i = g[0].offset, g === e) {
                        o.reverse().forEach(u);
                        do {
                            d(g.splice(0, 1)[0]), g = l()
                        } while (g === e && g.length && g[0].offset === i);
                        o.reverse().forEach(c)
                    } else "start" === g[0].event ? o.push(g[0].node) : o.pop(), d(g.splice(0, 1)[0])
                }
                return s + n(a.substr(i))
            }
        });
        const i = "</span>", s = e => !!e.kind;

        class o {
            constructor(e, n) {
                this.buffer = "", this.classPrefix = n.classPrefix, e.walk(this)
            }

            addText(e) {
                this.buffer += n(e)
            }

            openNode(e) {
                if (!s(e)) return;
                let n = e.kind;
                e.sublanguage || (n = `${this.classPrefix}${n}`), this.span(n)
            }

            closeNode(e) {
                s(e) && (this.buffer += i)
            }

            span(e) {
                this.buffer += `<span class="${e}">`
            }

            value() {
                return this.buffer
            }
        }

        class l {
            constructor() {
                this.rootNode = {children: []}, this.stack = [this.rootNode]
            }

            get top() {
                return this.stack[this.stack.length - 1]
            }

            get root() {
                return this.rootNode
            }

            static _walk(e, n) {
                return "string" == typeof n ? e.addText(n) : n.children && (e.openNode(n), n.children.forEach(n => this._walk(e, n)), e.closeNode(n)), e
            }

            static _collapse(e) {
                e.children && (e.children.every(e => "string" == typeof e) ? (e.text = e.children.join(""), delete e.children) : e.children.forEach(e => {
                    "string" != typeof e && l._collapse(e)
                }))
            }

            add(e) {
                this.top.children.push(e)
            }

            openNode(e) {
                let n = {kind: e, children: []};
                this.add(n), this.stack.push(n)
            }

            closeNode() {
                if (this.stack.length > 1) return this.stack.pop()
            }

            closeAllNodes() {
                for (; this.closeNode();) ;
            }

            toJSON() {
                return JSON.stringify(this.rootNode, null, 4)
            }

            walk(e) {
                return this.constructor._walk(e, this.rootNode)
            }
        }

        class c extends l {
            constructor(e) {
                super(), this.options = e
            }

            addKeyword(e, n) {
                "" !== e && (this.openNode(n), this.addText(e), this.closeNode())
            }

            addText(e) {
                "" !== e && this.add(e)
            }

            addSublanguage(e, n) {
                let t = e.root;
                t.kind = n, t.sublanguage = !0, this.add(t)
            }

            toHTML() {
                return new o(this, this.options).value()
            }

            finalize() {
            }
        }

        function u(e) {
            return e && e.source || e
        }

        const d = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
            g = {begin: "\\\\[\\s\\S]", relevance: 0},
            h = {className: "string", begin: "'", end: "'", illegal: "\\n", contains: [g]},
            f = {className: "string", begin: '"', end: '"', illegal: "\\n", contains: [g]},
            p = {begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},
            m = function (e, n, r) {
                var a = t({className: "comment", begin: e, end: n, contains: []}, r || {});
                return a.contains.push(p), a.contains.push({
                    className: "doctag",
                    begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
                    relevance: 0
                }), a
            }, b = m("//", "$"), v = m("/\\*", "\\*/"), x = m("#", "$");
        var _ = Object.freeze({
            __proto__: null,
            IDENT_RE: "[a-zA-Z]\\w*",
            UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
            NUMBER_RE: "\\b\\d+(\\.\\d+)?",
            C_NUMBER_RE: d,
            BINARY_NUMBER_RE: "\\b(0b[01]+)",
            RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
            BACKSLASH_ESCAPE: g,
            APOS_STRING_MODE: h,
            QUOTE_STRING_MODE: f,
            PHRASAL_WORDS_MODE: p,
            COMMENT: m,
            C_LINE_COMMENT_MODE: b,
            C_BLOCK_COMMENT_MODE: v,
            HASH_COMMENT_MODE: x,
            NUMBER_MODE: {className: "number", begin: "\\b\\d+(\\.\\d+)?", relevance: 0},
            C_NUMBER_MODE: {className: "number", begin: d, relevance: 0},
            BINARY_NUMBER_MODE: {className: "number", begin: "\\b(0b[01]+)", relevance: 0},
            CSS_NUMBER_MODE: {
                className: "number",
                begin: "\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
                relevance: 0
            },
            REGEXP_MODE: {
                begin: /(?=\/[^\/\n]*\/)/,
                contains: [{
                    className: "regexp",
                    begin: /\//,
                    end: /\/[gimuy]*/,
                    illegal: /\n/,
                    contains: [g, {begin: /\[/, end: /\]/, relevance: 0, contains: [g]}]
                }]
            },
            TITLE_MODE: {className: "title", begin: "[a-zA-Z]\\w*", relevance: 0},
            UNDERSCORE_TITLE_MODE: {className: "title", begin: "[a-zA-Z_]\\w*", relevance: 0},
            METHOD_GUARD: {begin: "\\.\\s*[a-zA-Z_]\\w*", relevance: 0}
        }), E = "of and for in not or if then".split(" ");

        function R(e, n) {
            return n ? +n : (t = e, E.includes(t.toLowerCase()) ? 0 : 1);
            var t
        }

        const N = n, w = t, {nodeStream: y, mergeStreams: O} = a;
        return function (n) {
            var r = [], a = {}, i = {}, s = [], o = !0, l = /((^(<[^>]+>|\t|)+|(?:\n)))/gm,
                d = "Could not find the language '{}', did you forget to load/include a language module?", g = {
                    noHighlightRe: /^(no-?highlight)$/i,
                    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
                    classPrefix: "hljs-",
                    tabReplace: null,
                    useBR: !1,
                    languages: void 0,
                    __emitter: c
                };

            function h(e) {
                return g.noHighlightRe.test(e)
            }

            function f(e, n, t, r) {
                var a = {code: n, language: e};
                T("before:highlight", a);
                var i = a.result ? a.result : p(a.language, a.code, t, r);
                return i.code = a.code, T("after:highlight", i), i
            }

            function p(e, n, r, i) {
                var s = n;

                function l(e, n) {
                    var t = v.case_insensitive ? n[0].toLowerCase() : n[0];
                    return e.keywords.hasOwnProperty(t) && e.keywords[t]
                }

                function c() {
                    null != _.subLanguage ? function () {
                        if ("" !== k) {
                            var e = "string" == typeof _.subLanguage;
                            if (!e || a[_.subLanguage]) {
                                var n = e ? p(_.subLanguage, k, !0, E[_.subLanguage]) : m(k, _.subLanguage.length ? _.subLanguage : void 0);
                                _.relevance > 0 && (T += n.relevance), e && (E[_.subLanguage] = n.top), w.addSublanguage(n.emitter, n.language)
                            } else w.addText(k)
                        }
                    }() : function () {
                        var e, n, t, r;
                        if (_.keywords) {
                            for (n = 0, _.lexemesRe.lastIndex = 0, t = _.lexemesRe.exec(k), r = ""; t;) {
                                r += k.substring(n, t.index);
                                var a = null;
                                (e = l(_, t)) ? (w.addText(r), r = "", T += e[1], a = e[0], w.addKeyword(t[0], a)) : r += t[0], n = _.lexemesRe.lastIndex, t = _.lexemesRe.exec(k)
                            }
                            r += k.substr(n), w.addText(r)
                        } else w.addText(k)
                    }(), k = ""
                }

                function h(e) {
                    e.className && w.openNode(e.className), _ = Object.create(e, {parent: {value: _}})
                }

                var f = {};

                function b(n, t) {
                    var a, i = t && t[0];
                    if (k += n, null == i) return c(), 0;
                    if ("begin" == f.type && "end" == t.type && f.index == t.index && "" === i) {
                        if (k += s.slice(t.index, t.index + 1), !o) throw(a = Error("0 width match regex")).languageName = e, a.badRule = f.rule, a;
                        return 1
                    }
                    if (f = t, "begin" === t.type) return function (e) {
                        var n = e[0], t = e.rule;
                        return t.__onBegin && (t.__onBegin(e) || {}).ignoreMatch ? function (e) {
                            return 0 === _.matcher.regexIndex ? (k += e[0], 1) : (A = !0, 0)
                        }(n) : (t && t.endSameAsBegin && (t.endRe = RegExp(n.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")), t.skip ? k += n : (t.excludeBegin && (k += n), c(), t.returnBegin || t.excludeBegin || (k = n)), h(t), t.returnBegin ? 0 : n.length)
                    }(t);
                    if ("illegal" === t.type && !r) throw(a = Error('Illegal lexeme "' + i + '" for mode "' + (_.className || "<unnamed>") + '"')).mode = _, a;
                    if ("end" === t.type) {
                        var l = function (e) {
                            var n = e[0], t = s.substr(e.index), r = function e(n, t) {
                                if (function (e, n) {
                                    var t = e && e.exec(n);
                                    return t && 0 === t.index
                                }(n.endRe, t)) {
                                    for (; n.endsParent && n.parent;) n = n.parent;
                                    return n
                                }
                                if (n.endsWithParent) return e(n.parent, t)
                            }(_, t);
                            if (r) {
                                var a = _;
                                a.skip ? k += n : (a.returnEnd || a.excludeEnd || (k += n), c(), a.excludeEnd && (k = n));
                                do {
                                    _.className && w.closeNode(), _.skip || _.subLanguage || (T += _.relevance), _ = _.parent
                                } while (_ !== r.parent);
                                return r.starts && (r.endSameAsBegin && (r.starts.endRe = r.endRe), h(r.starts)), a.returnEnd ? 0 : n.length
                            }
                        }(t);
                        if (null != l) return l
                    }
                    return k += i, i.length
                }

                var v = M(e);
                if (!v) throw console.error(d.replace("{}", e)), Error('Unknown language: "' + e + '"');
                !function (e) {
                    function n(n, t) {
                        return RegExp(u(n), "m" + (e.case_insensitive ? "i" : "") + (t ? "g" : ""))
                    }

                    class r {
                        constructor() {
                            this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
                        }

                        addRule(e, n) {
                            n.position = this.position++, this.matchIndexes[this.matchAt] = n, this.regexes.push([n, e]), this.matchAt += function (e) {
                                return RegExp(e.toString() + "|").exec("").length - 1
                            }(e) + 1
                        }

                        compile() {
                            0 === this.regexes.length && (this.exec = () => null);
                            let e = this.regexes.map(e => e[1]);
                            this.matcherRe = n(function (e, n) {
                                for (var t = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./, r = 0, a = "", i = 0; i < e.length; i++) {
                                    var s = r += 1, o = u(e[i]);
                                    for (i > 0 && (a += "|"), a += "("; o.length > 0;) {
                                        var l = t.exec(o);
                                        if (null == l) {
                                            a += o;
                                            break
                                        }
                                        a += o.substring(0, l.index), o = o.substring(l.index + l[0].length), "\\" == l[0][0] && l[1] ? a += "\\" + (+l[1] + s) : (a += l[0], "(" == l[0] && r++)
                                    }
                                    a += ")"
                                }
                                return a
                            }(e), !0), this.lastIndex = 0
                        }

                        exec(e) {
                            this.matcherRe.lastIndex = this.lastIndex;
                            let n = this.matcherRe.exec(e);
                            if (!n) return null;
                            let t = n.findIndex((e, n) => n > 0 && null != e), r = this.matchIndexes[t];
                            return Object.assign(n, r)
                        }
                    }

                    class a {
                        constructor() {
                            this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
                        }

                        getMatcher(e) {
                            if (this.multiRegexes[e]) return this.multiRegexes[e];
                            let n = new r;
                            return this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)), n.compile(), this.multiRegexes[e] = n, n
                        }

                        considerAll() {
                            this.regexIndex = 0
                        }

                        addRule(e, n) {
                            this.rules.push([e, n]), "begin" === n.type && this.count++
                        }

                        exec(e) {
                            let n = this.getMatcher(this.regexIndex);
                            n.lastIndex = this.lastIndex;
                            let t = n.exec(e);
                            return t && (this.regexIndex += t.position + 1, this.regexIndex === this.count && (this.regexIndex = 0)), t
                        }
                    }

                    function i(e) {
                        let n = e.input[e.index - 1], t = e.input[e.index + e[0].length];
                        if ("." === n || "." === t) return {ignoreMatch: !0}
                    }

                    if (e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
                    !function r(s, o) {
                        s.compiled || (s.compiled = !0, s.__onBegin = null, s.keywords = s.keywords || s.beginKeywords, s.keywords && (s.keywords = function (e, n) {
                            var t = {};
                            return "string" == typeof e ? r("keyword", e) : Object.keys(e).forEach((function (n) {
                                r(n, e[n])
                            })), t;

                            function r(e, r) {
                                n && (r = r.toLowerCase()), r.split(" ").forEach((function (n) {
                                    var r = n.split("|");
                                    t[r[0]] = [e, R(r[0], r[1])]
                                }))
                            }
                        }(s.keywords, e.case_insensitive)), s.lexemesRe = n(s.lexemes || /\w+/, !0), o && (s.beginKeywords && (s.begin = "\\b(" + s.beginKeywords.split(" ").join("|") + ")(?=\\b|\\s)", s.__onBegin = i), s.begin || (s.begin = /\B|\b/), s.beginRe = n(s.begin), s.endSameAsBegin && (s.end = s.begin), s.end || s.endsWithParent || (s.end = /\B|\b/), s.end && (s.endRe = n(s.end)), s.terminator_end = u(s.end) || "", s.endsWithParent && o.terminator_end && (s.terminator_end += (s.end ? "|" : "") + o.terminator_end)), s.illegal && (s.illegalRe = n(s.illegal)), null == s.relevance && (s.relevance = 1), s.contains || (s.contains = []), s.contains = [].concat(...s.contains.map((function (e) {
                            return function (e) {
                                return e.variants && !e.cached_variants && (e.cached_variants = e.variants.map((function (n) {
                                    return t(e, {variants: null}, n)
                                }))), e.cached_variants ? e.cached_variants : function e(n) {
                                    return !!n && (n.endsWithParent || e(n.starts))
                                }(e) ? t(e, {starts: e.starts ? t(e.starts) : null}) : Object.isFrozen(e) ? t(e) : e
                            }("self" === e ? s : e)
                        }))), s.contains.forEach((function (e) {
                            r(e, s)
                        })), s.starts && r(s.starts, o), s.matcher = function (e) {
                            let n = new a;
                            return e.contains.forEach(e => n.addRule(e.begin, {
                                rule: e,
                                type: "begin"
                            })), e.terminator_end && n.addRule(e.terminator_end, {type: "end"}), e.illegal && n.addRule(e.illegal, {type: "illegal"}), n
                        }(s))
                    }(e)
                }(v);
                var x, _ = i || v, E = {}, w = new g.__emitter(g);
                !function () {
                    for (var e = [], n = _; n !== v; n = n.parent) n.className && e.unshift(n.className);
                    e.forEach(e => w.openNode(e))
                }();
                var y, O, k = "", T = 0, L = 0;
                try {
                    var A = !1;
                    for (_.matcher.considerAll(); A ? A = !1 : (_.matcher.lastIndex = L, _.matcher.considerAll()), y = _.matcher.exec(s);) O = b(s.substring(L, y.index), y), L = y.index + O;
                    return b(s.substr(L)), w.closeAllNodes(), w.finalize(), x = w.toHTML(), {
                        relevance: T,
                        value: x,
                        language: e,
                        illegal: !1,
                        emitter: w,
                        top: _
                    }
                } catch (n) {
                    if (n.message && n.message.includes("Illegal")) return {
                        illegal: !0,
                        illegalBy: {msg: n.message, context: s.slice(L - 100, L + 100), mode: n.mode},
                        sofar: x,
                        relevance: 0,
                        value: N(s),
                        emitter: w
                    };
                    if (o) return {relevance: 0, value: N(s), emitter: w, language: e, top: _, errorRaised: n};
                    throw n
                }
            }

            function m(e, n) {
                n = n || g.languages || Object.keys(a);
                var t = function (e) {
                    const n = {relevance: 0, emitter: new g.__emitter(g), value: N(e), illegal: !1, top: E};
                    return n.emitter.addText(e), n
                }(e), r = t;
                return n.filter(M).filter(k).forEach((function (n) {
                    var a = p(n, e, !1);
                    a.language = n, a.relevance > r.relevance && (r = a), a.relevance > t.relevance && (r = t, t = a)
                })), r.language && (t.second_best = r), t
            }

            function b(e) {
                return g.tabReplace || g.useBR ? e.replace(l, (function (e, n) {
                    return g.useBR && "\n" === e ? "<br>" : g.tabReplace ? n.replace(/\t/g, g.tabReplace) : ""
                })) : e
            }

            function v(e) {
                var n, t, r, a, s, o = function (e) {
                    var n, t = e.className + " ";
                    if (t += e.parentNode ? e.parentNode.className : "", n = g.languageDetectRe.exec(t)) {
                        var r = M(n[1]);
                        return r || (console.warn(d.replace("{}", n[1])), console.warn("Falling back to no-highlight mode for this block.", e)), r ? n[1] : "no-highlight"
                    }
                    return t.split(/\s+/).find(e => h(e) || M(e))
                }(e);
                h(o) || (T("before:highlightBlock", {
                    block: e,
                    language: o
                }), g.useBR ? (n = document.createElement("div")).innerHTML = e.innerHTML.replace(/\n/g, "").replace(/<br[ \/]*>/g, "\n") : n = e, s = n.textContent, r = o ? f(o, s, !0) : m(s), (t = y(n)).length && ((a = document.createElement("div")).innerHTML = r.value, r.value = O(t, y(a), s)), r.value = b(r.value), T("after:highlightBlock", {
                    block: e,
                    result: r
                }), e.innerHTML = r.value, e.className = function (e, n, t) {
                    var r = n ? i[n] : t, a = [e.trim()];
                    return e.match(/\bhljs\b/) || a.push("hljs"), e.includes(r) || a.push(r), a.join(" ").trim()
                }(e.className, o, r.language), e.result = {
                    language: r.language,
                    re: r.relevance
                }, r.second_best && (e.second_best = {
                    language: r.second_best.language,
                    re: r.second_best.relevance
                }))
            }

            function x() {
                if (!x.called) {
                    x.called = !0;
                    var e = document.querySelectorAll("pre code");
                    r.forEach.call(e, v)
                }
            }

            const E = {disableAutodetect: !0, name: "Plain text"};

            function M(e) {
                return e = (e || "").toLowerCase(), a[e] || a[i[e]]
            }

            function k(e) {
                var n = M(e);
                return n && !n.disableAutodetect
            }

            function T(e, n) {
                var t = e;
                s.forEach((function (e) {
                    e[t] && e[t](n)
                }))
            }

            Object.assign(n, {
                highlight: f, highlightAuto: m, fixMarkup: b, highlightBlock: v, configure: function (e) {
                    g = w(g, e)
                }, initHighlighting: x, initHighlightingOnLoad: function () {
                    window.addEventListener("DOMContentLoaded", x, !1)
                }, registerLanguage: function (e, t) {
                    var r;
                    try {
                        r = t(n)
                    } catch (n) {
                        if (console.error("Language definition for '{}' could not be registered.".replace("{}", e)), !o) throw n;
                        console.error(n), r = E
                    }
                    r.name || (r.name = e), a[e] = r, r.rawDefinition = t.bind(null, n), r.aliases && r.aliases.forEach((function (n) {
                        i[n] = e
                    }))
                }, listLanguages: function () {
                    return Object.keys(a)
                }, getLanguage: M, requireLanguage: function (e) {
                    var n = M(e);
                    if (n) return n;
                    throw Error("The '{}' language is required, but not loaded.".replace("{}", e))
                }, autoDetection: k, inherit: w, addPlugin: function (e, n) {
                    s.push(e)
                }
            }), n.debugMode = function () {
                o = !1
            }, n.safeMode = function () {
                o = !0
            }, n.versionString = "10.0.1";
            for (const n in _) "object" == typeof _[n] && e(_[n]);
            return Object.assign(n, _), n
        }({})
    }));
    hljs.registerLanguage("scss", function () {
        "use strict";
        return function (e) {
            var t = {className: "variable", begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b"},
                i = {className: "number", begin: "#[0-9A-Fa-f]+"};
            return e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, e.C_BLOCK_COMMENT_MODE, {
                name: "SCSS",
                case_insensitive: !0,
                illegal: "[=/|']",
                contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                    className: "selector-id",
                    begin: "\\#[A-Za-z0-9_-]+",
                    relevance: 0
                }, {className: "selector-class", begin: "\\.[A-Za-z0-9_-]+", relevance: 0}, {
                    className: "selector-attr",
                    begin: "\\[",
                    end: "\\]",
                    illegal: "$"
                }, {
                    className: "selector-tag",
                    begin: "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
                    relevance: 0
                }, {
                    className: "selector-pseudo",
                    begin: ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
                }, {
                    className: "selector-pseudo",
                    begin: "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
                }, t, {
                    className: "attribute",
                    begin: "\\b(src|z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
                    illegal: "[^\\s]"
                }, {begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"}, {
                    begin: ":",
                    end: ";",
                    contains: [t, i, e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
                        className: "meta",
                        begin: "!important"
                    }]
                }, {begin: "@(page|font-face)", lexemes: "@[a-z-]+", keywords: "@page @font-face"}, {
                    begin: "@",
                    end: "[{;]",
                    returnBegin: !0,
                    keywords: "and or not only",
                    contains: [{
                        begin: "@[a-z-]+",
                        className: "keyword"
                    }, t, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, i, e.CSS_NUMBER_MODE]
                }]
            }
        }
    }());
    hljs.registerLanguage("http", function () {
        "use strict";
        return function (e) {
            var n = "HTTP/[0-9\\.]+";
            return {
                name: "HTTP",
                aliases: ["https"],
                illegal: "\\S",
                contains: [{
                    begin: "^" + n,
                    end: "$",
                    contains: [{className: "number", begin: "\\b\\d{3}\\b"}]
                }, {
                    begin: "^[A-Z]+ (.*?) " + n + "$",
                    returnBegin: !0,
                    end: "$",
                    contains: [{
                        className: "string",
                        begin: " ",
                        end: " ",
                        excludeBegin: !0,
                        excludeEnd: !0
                    }, {begin: n}, {className: "keyword", begin: "[A-Z]+"}]
                }, {
                    className: "attribute",
                    begin: "^\\w",
                    end: ": ",
                    excludeEnd: !0,
                    illegal: "\\n|\\s|=",
                    starts: {end: "$", relevance: 0}
                }, {begin: "\\n\\n", starts: {subLanguage: [], endsWithParent: !0}}]
            }
        }
    }());
    hljs.registerLanguage("xml", function () {
        "use strict";
        return function (e) {
            var n = {className: "symbol", begin: "&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;"},
                a = {
                    begin: "\\s",
                    contains: [{className: "meta-keyword", begin: "#?[a-z_][a-z1-9_-]+", illegal: "\\n"}]
                },
                s = e.inherit(a, {begin: "\\(", end: "\\)"}),
                t = e.inherit(e.APOS_STRING_MODE, {className: "meta-string"}),
                i = e.inherit(e.QUOTE_STRING_MODE, {className: "meta-string"}), c = {
                    endsWithParent: !0,
                    illegal: /</,
                    relevance: 0,
                    contains: [{className: "attr", begin: "[A-Za-z0-9\\._:-]+", relevance: 0}, {
                        begin: /=\s*/,
                        relevance: 0,
                        contains: [{
                            className: "string",
                            endsParent: !0,
                            variants: [{begin: /"/, end: /"/, contains: [n]}, {
                                begin: /'/,
                                end: /'/,
                                contains: [n]
                            }, {begin: /[^\s"'=<>`]+/}]
                        }]
                    }]
                };
            return {
                name: "HTML, XML",
                aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
                case_insensitive: !0,
                contains: [{
                    className: "meta",
                    begin: "<![a-z]",
                    end: ">",
                    relevance: 10,
                    contains: [a, i, t, s, {
                        begin: "\\[",
                        end: "\\]",
                        contains: [{className: "meta", begin: "<![a-z]", end: ">", contains: [a, s, i, t]}]
                    }]
                }, e.COMMENT("\x3c!--", "--\x3e", {relevance: 10}), {
                    begin: "<\\!\\[CDATA\\[",
                    end: "\\]\\]>",
                    relevance: 10
                }, n, {className: "meta", begin: /<\?xml/, end: /\?>/, relevance: 10}, {
                    className: "tag",
                    begin: "<style(?=\\s|>)",
                    end: ">",
                    keywords: {name: "style"},
                    contains: [c],
                    starts: {end: "</style>", returnEnd: !0, subLanguage: ["css", "xml"]}
                }, {
                    className: "tag",
                    begin: "<script(?=\\s|>)",
                    end: ">",
                    keywords: {name: "script"},
                    contains: [c],
                    starts: {end: "<\/script>", returnEnd: !0, subLanguage: ["javascript", "handlebars", "xml"]}
                }, {
                    className: "tag",
                    begin: "</?",
                    end: "/?>",
                    contains: [{className: "name", begin: /[^\/><\s]+/, relevance: 0}, c]
                }]
            }
        }
    }());
    hljs.registerLanguage("css", function () {
        "use strict";
        return function (e) {
            var n = {
                begin: /(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/,
                returnBegin: !0,
                end: ";",
                endsWithParent: !0,
                contains: [{
                    className: "attribute",
                    begin: /\S/,
                    end: ":",
                    excludeEnd: !0,
                    starts: {
                        endsWithParent: !0,
                        excludeEnd: !0,
                        contains: [{
                            begin: /[\w-]+\(/,
                            returnBegin: !0,
                            contains: [{className: "built_in", begin: /[\w-]+/}, {
                                begin: /\(/,
                                end: /\)/,
                                contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE]
                            }]
                        }, e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, e.C_BLOCK_COMMENT_MODE, {
                            className: "number",
                            begin: "#[0-9A-Fa-f]+"
                        }, {className: "meta", begin: "!important"}]
                    }
                }]
            };
            return {
                name: "CSS",
                case_insensitive: !0,
                illegal: /[=\/|'\$]/,
                contains: [e.C_BLOCK_COMMENT_MODE, {
                    className: "selector-id",
                    begin: /#[A-Za-z0-9_-]+/
                }, {className: "selector-class", begin: /\.[A-Za-z0-9_-]+/}, {
                    className: "selector-attr",
                    begin: /\[/,
                    end: /\]/,
                    illegal: "$",
                    contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
                }, {className: "selector-pseudo", begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/}, {
                    begin: "@(page|font-face)",
                    lexemes: "@[a-z-]+",
                    keywords: "@page @font-face"
                }, {
                    begin: "@",
                    end: "[{;]",
                    illegal: /:/,
                    returnBegin: !0,
                    contains: [{className: "keyword", begin: /@\-?\w[\w]*(\-\w+)*/}, {
                        begin: /\s/,
                        endsWithParent: !0,
                        excludeEnd: !0,
                        relevance: 0,
                        keywords: "and or not only",
                        contains: [{
                            begin: /[a-z-]+:/,
                            className: "attribute"
                        }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE]
                    }]
                }, {className: "selector-tag", begin: "[a-zA-Z-][a-zA-Z0-9_-]*", relevance: 0}, {
                    begin: "{",
                    end: "}",
                    illegal: /\S/,
                    contains: [e.C_BLOCK_COMMENT_MODE, n]
                }]
            }
        }
    }());
    hljs.registerLanguage("json", function () {
        "use strict";
        return function (n) {
            var e = {literal: "true false null"}, i = [n.C_LINE_COMMENT_MODE, n.C_BLOCK_COMMENT_MODE],
                t = [n.QUOTE_STRING_MODE, n.C_NUMBER_MODE],
                a = {end: ",", endsWithParent: !0, excludeEnd: !0, contains: t, keywords: e}, l = {
                    begin: "{",
                    end: "}",
                    contains: [{
                        className: "attr",
                        begin: /"/,
                        end: /"/,
                        contains: [n.BACKSLASH_ESCAPE],
                        illegal: "\\n"
                    }, n.inherit(a, {begin: /:/})].concat(i),
                    illegal: "\\S"
                }, s = {begin: "\\[", end: "\\]", contains: [n.inherit(a)], illegal: "\\S"};
            return t.push(l, s), i.forEach((function (n) {
                t.push(n)
            })), {name: "JSON", contains: t, keywords: e, illegal: "\\S"}
        }
    }());
    hljs.registerLanguage("javascript", function () {
        "use strict";
        return function (e) {
            var n = {begin: /<[A-Za-z0-9\\._:-]+/, end: /\/[A-Za-z0-9\\._:-]+>|\/>/},
                a = "[A-Za-z$_][0-9A-Za-z$_]*", s = {
                    keyword: "in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",
                    literal: "true false null undefined NaN Infinity",
                    built_in: "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"
                }, r = {
                    className: "number",
                    variants: [{begin: "\\b(0[bB][01]+)n?"}, {begin: "\\b(0[oO][0-7]+)n?"}, {begin: e.C_NUMBER_RE + "n?"}],
                    relevance: 0
                }, i = {className: "subst", begin: "\\$\\{", end: "\\}", keywords: s, contains: []}, t = {
                    begin: "html`",
                    end: "",
                    starts: {end: "`", returnEnd: !1, contains: [e.BACKSLASH_ESCAPE, i], subLanguage: "xml"}
                }, c = {
                    begin: "css`",
                    end: "",
                    starts: {end: "`", returnEnd: !1, contains: [e.BACKSLASH_ESCAPE, i], subLanguage: "css"}
                }, o = {className: "string", begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE, i]};
            i.contains = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, t, c, o, r, e.REGEXP_MODE];
            var l = i.contains.concat([e.C_BLOCK_COMMENT_MODE, e.C_LINE_COMMENT_MODE]),
                d = {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    contains: l
                };
            return {
                name: "JavaScript",
                aliases: ["js", "jsx", "mjs", "cjs"],
                keywords: s,
                contains: [{className: "meta", relevance: 10, begin: /^\s*['"]use (strict|asm)['"]/}, {
                    className: "meta",
                    begin: /^#!/,
                    end: /$/
                }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, t, c, o, e.C_LINE_COMMENT_MODE, e.COMMENT("/\\*\\*", "\\*/", {
                    relevance: 0,
                    contains: [{
                        className: "doctag",
                        begin: "@[A-Za-z]+",
                        contains: [{className: "type", begin: "\\{", end: "\\}", relevance: 0}, {
                            className: "variable",
                            begin: a + "(?=\\s*(-)|$)",
                            endsParent: !0,
                            relevance: 0
                        }, {begin: /(?=[^\n])\s/, relevance: 0}]
                    }]
                }), e.C_BLOCK_COMMENT_MODE, r, {
                    begin: /[{,\n]\s*/,
                    relevance: 0,
                    contains: [{
                        begin: a + "\\s*:",
                        returnBegin: !0,
                        relevance: 0,
                        contains: [{className: "attr", begin: a, relevance: 0}]
                    }]
                }, {
                    begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                    keywords: "return throw case",
                    contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.REGEXP_MODE, {
                        className: "function",
                        begin: "(\\(.*?\\)|" + a + ")\\s*=>",
                        returnBegin: !0,
                        end: "\\s*=>",
                        contains: [{
                            className: "params",
                            variants: [{begin: a}, {begin: /\(\s*\)/}, {
                                begin: /\(/,
                                end: /\)/,
                                excludeBegin: !0,
                                excludeEnd: !0,
                                keywords: s,
                                contains: l
                            }]
                        }]
                    }, {begin: /,/, relevance: 0}, {
                        className: "",
                        begin: /\s/,
                        end: /\s*/,
                        skip: !0
                    }, {
                        variants: [{begin: "<>", end: "</>"}, {begin: n.begin, end: n.end}],
                        subLanguage: "xml",
                        contains: [{begin: n.begin, end: n.end, skip: !0, contains: ["self"]}]
                    }],
                    relevance: 0
                }, {
                    className: "function",
                    beginKeywords: "function",
                    end: /\{/,
                    excludeEnd: !0,
                    contains: [e.inherit(e.TITLE_MODE, {begin: a}), d],
                    illegal: /\[|%/
                }, {begin: /\$[(.]/}, e.METHOD_GUARD, {
                    className: "class",
                    beginKeywords: "class",
                    end: /[{;=]/,
                    excludeEnd: !0,
                    illegal: /[:"\[\]]/,
                    contains: [{beginKeywords: "extends"}, e.UNDERSCORE_TITLE_MODE]
                }, {beginKeywords: "constructor", end: /\{/, excludeEnd: !0}, {
                    begin: "(get|set)\\s*(?=" + a + "\\()",
                    end: /{/,
                    keywords: "get set",
                    contains: [e.inherit(e.TITLE_MODE, {begin: a}), {begin: /\(\)/}, d]
                }],
                illegal: /#(?!!)/
            }
        }
    }());
    document.documentElement.appendNewChild({
        type: "style",
        innerHTML: ".pg-render-code-icon .mi {font-size: 16px;margin-right:3px;}.pg-render-code-icon * {vertical-align: middle;color:#666;} .pg-render-code-icon .text-description{font-size:13px;}.hljs{display:block;overflow-x:auto;padding:.5em;color:var(--default800);border-radius:3px;font:14px/21px 'Jetbrains Mono', monospace;}.hljs-comment,.hljs-quote{color:var(--secondary300);font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:var(--primary700)}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:var(--danger500)}.hljs-literal{color:#0184bb}.hljs-addition,.hljs-attribute,.hljs-meta-string,.hljs-regexp,.hljs-string{color:var(--success500)}.hljs-built_in,.hljs-class .hljs-title{color:#c18401}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:var(--warning700);}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#4078f2}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}.renderCode .collapseCode{width:80%;margin:0 auto}.renderCode .rendered{width:50%;margin:0 auto;padding:6px 25% 12px 25%;border-bottom: 1px solid #efefef;}.pg-render-code{width:fit-content;margin:0 auto;}.renderCode{border: 1px solid #efefef;border-radius: 6px;}"
    });
    (()=>{})(); // Render
    const render = (mutationRecord) => {
        /**
         * @param mutationRecord: Callback of MutationObserve
         *  => mutations: MutationRecord[]
         *      can be call in this function, type should be "childList".
         * @example init({type: "childList", addedNodes: document.body.$("*")});
         *
         * Init Elements, eg. initialized all HTMLButtonElements that [ripple] !== "false", initialized all toggles...
         */
        let changedInf = [],
            attrList = ["class"];

        if (mutationRecord.target && mutationRecord.target.classList.contains("renderCode"))
            changedInf.push([mutationRecord.target, "class"]);
        else if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0)
            mutationRecord.addedNodes.forEach(node => {
                let list = [];
                attrList.forEach(attr => {
                    if (node.attributes[attr] !== undefined) {
                        list.push(attr);
                    }
                });
                if (list.length > 0)
                    changedInf.push([node, list]);
            });

        if (changedInf.length > 0)
            changedInf.forEach(detail => {
                if (detail[0].classList.contains("renderCode")) {
                    detail[0].appendNewChild({type: "div", attr: [["class", "pg-render-code"]]});
                    detail[0].children.last().appendNewChild({
                        type: "div",
                        attr: [["class", "pg-render-code-icon btn-link"], ["data-toggle", "collapse"], ["data-target", `#${detail[0].id} .collapseCode`]],
                        innerHTML: "<span class='mi'>code</span><span class='text-description'>Code 代码</span>"
                    });
                    let val = $(`#${detail[0].id} .rendered`)[0].innerHTML, space = "";
                    for (let i = 0; i < val.length; i++) {
                        if (!val[i].match(new RegExp(/\s/))) {
                            for (let j = 0; j < i - 1; j++)
                                space += " ";
                            val = val.replace(new RegExp(space, "g"), "").replace(/\n/, "")
                            break;
                        }
                    }
                    for (let i = val.length - 1; i > 0; i--) {
                        if (!val[i].match(new RegExp(/\s/))) {
                            let s = ""
                            for (let j = 0; j < i - 1; j++)
                                s += " ";
                            val = val.replace(new RegExp(s + "$"), "")
                        }
                    }
                    $(`#${detail[0].id} code.html`)[0].innerHTML = val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
                    $(`#${detail[0].id} pre code`).forEach(e => {
                        hljs.highlightBlock(e);
                    });
                    detail[0].children.last().appendNewChild({
                        type: "div",
                        attr: [["class", "pg-render-code-icon btn-link"]],
                        innerHTML: "<span class='mi'>file_copy</span><span class='text-description'>Copy 复制</span>",
                        onclick: () => {
                            copy(detail[0].querySelector(".rendered").outerHTML);
                        }
                    });
                }
            });
    };
    const mO = new MutationObserver(render);
    mO.observe(document.body, {subtree: true, childList: true, attributes: true});
    render({type: "childList", addedNodes: $("*")});
    $("#nav .dashboard-brand")[0].innerHTML="<svg height=\"15\" viewBox=\"0 0 437 36\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.8 0c3 0 5.5.8 7.2 2.3 1.7 1.6 2.7 3.8 2.7 6.6s-.9 5-2.7 6.6c-1.7 1.5-4.1 2.3-7.2 2.3H3.3v10.9H0V0h9.8zM3.3 14.5h6.5c2.2 0 3.9-.5 5-1.5 1.1-.9 1.6-2.3 1.6-4.1s-.5-3.2-1.6-4.1c-1.1-1-2.8-1.5-5-1.5H3.3v11.2zM37.9 9.3c1.6 1.4 2.4 3.4 2.4 6v4.4H25.8v1.1c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2h.5c1.5 0 2.7-.2 3.6-.7.8-.5 1.4-1 1.7-1.9l3 1.2c-.6 1.6-1.7 2.8-3.2 3.5-1.4.8-3.1 1.1-5.1 1.1h-.5c-2.7 0-4.9-.7-6.4-2.1-1.6-1.4-2.5-3.4-2.5-6v-5.5c0-2.5.9-4.6 2.5-6C26.6 7.7 28.7 7 31.4 7c2.8.3 5 1 6.5 2.3zm-10.8 2.5c-.9.8-1.3 2-1.3 3.5v1.1H37v-1.1c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.3.4-4.3 1.2zM60.7 9.3c1.6 1.4 2.4 3.4 2.4 6v13.5h-3.3V15.3c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.4.4-4.3 1.2c-.9.8-1.3 2-1.3 3.5v13.5h-3.3V7.3h3.3v1.4c1.5-.9 3.4-1.4 5.6-1.4 2.7 0 4.9.7 6.5 2zM82.1 8.7V7.4h3.3V28c0 2.5-.8 4.6-2.4 6-1.6 1.4-3.7 2.1-6.5 2.1H76c-2 0-3.7-.4-5.1-1.1-1.5-.8-2.5-2-3.2-3.5l3-1.2c.3.9.9 1.4 1.7 1.9.9.5 2.1.7 3.6.7h.5c1.9 0 3.4-.4 4.3-1.2.9-.8 1.3-2 1.3-3.5v-.7c-1.4.9-3.3 1.4-5.6 1.4-2.7 0-4.9-.7-6.4-2.1-1.6-1.4-2.5-3.5-2.5-6v-5.5c0-2.5.9-4.6 2.5-6 1.6-1.4 3.7-2.1 6.4-2.1 2.3.1 4.2.5 5.6 1.5zm-9.9 3.1c-.9.8-1.3 1.9-1.3 3.5v5.5c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2s3.4-.5 4.3-1.2c.9-.8 1.3-2 1.3-3.5v-5.5c0-1.6-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.3.4-4.3 1.2zM105.7 28.7v-1.4c-1.5.9-3.4 1.4-5.6 1.4-2.8 0-4.9-.7-6.5-2.1-1.6-1.4-2.4-3.4-2.4-6V7.3h3.3v13.5c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2s3.4-.4 4.3-1.2c.9-.8 1.3-2 1.3-3.5V7.3h3.3v21.5h-3.3zM118.9 2.1c0 1.1-.9 2.1-2.1 2.1-1.1 0-2.1-.9-2.1-2.1 0-1.1.9-2.1 2.1-2.1 1.1 0 2.1.9 2.1 2.1zm-3.7 26.6V7.3h3.3v21.5h-3.3zM140 9.3c1.6 1.4 2.4 3.4 2.4 6v13.5h-3.3V15.3c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.4.4-4.3 1.2c-.9.8-1.3 2-1.3 3.5v13.5h-3.3V7.3h3.3v1.4c1.5-.9 3.4-1.4 5.6-1.4 2.8 0 4.9.7 6.5 2zM168.6 0c1.5 0 2.9.2 4.1.7 1.3.5 2.3 1.2 3.2 2.2 1.7 1.9 2.5 4.5 2.5 7.8V18c0 3.3-.9 6-2.5 7.8-.9 1-1.9 1.7-3.2 2.2-1.2.5-2.6.7-4.1.7h-9.8V0h9.8zm-6.5 25.5h6.5c2.1 0 3.8-.6 4.8-1.8 1.1-1.3 1.7-3.2 1.7-5.7v-7.3c0-2.5-.6-4.4-1.7-5.6-1.1-1.2-2.7-1.8-4.8-1.8h-6.5v22.2zM198.4 9.3c1.6 1.4 2.4 3.4 2.4 6v4.4h-14.5v1.1c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2h.5c1.5 0 2.7-.2 3.6-.7.8-.5 1.4-1 1.7-1.9l3 1.2c-.6 1.6-1.7 2.8-3.2 3.5-1.4.8-3.1 1.1-5.1 1.1h-.5c-2.7 0-4.9-.7-6.4-2.1-1.6-1.4-2.5-3.4-2.5-6v-5.5c0-2.5.9-4.6 2.5-6 1.6-1.4 3.7-2.1 6.4-2.1 2.8.3 5 1 6.5 2.3zm-10.8 2.5c-.9.8-1.3 2-1.3 3.5v1.1h11.2v-1.1c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.3.4-4.3 1.2zM213.9 7.3c2 0 3.7.4 5.1 1.1 1.5.8 2.5 2 3.2 3.5l-3 1.2c-.3-.9-.9-1.4-1.7-1.9-.9-.5-2.1-.7-3.6-.7h-.5c-2.5 0-3.8.5-4.5.9-.8.5-1.1 1.1-1.1 2 0 .9.3 1.5 1.1 2 .7.4 2 .9 4.5.9 2.6 0 4.8.5 6.3 1.4.8.5 1.5 1.2 2 2s.7 1.8.7 2.8c0 1-.2 1.9-.7 2.8-.5.8-1.1 1.5-2 2-1.5.9-3.7 1.4-6.3 1.4h-.5c-2 0-3.7-.4-5.1-1.1-1.5-.8-2.5-2-3.2-3.5l3-1.2c.3.9.9 1.4 1.7 1.9.9.5 2.1.7 3.6.7h.5c2.5 0 3.9-.5 4.5-.9.8-.5 1.1-1.1 1.1-2 0-.9-.3-1.5-1.1-2-.7-.4-2-.9-4.5-.9-2.6 0-4.7-.5-6.2-1.4-.9-.5-1.5-1.2-2-2s-.7-1.8-.7-2.8c0-1 .2-1.9.7-2.8.5-.8 1.1-1.5 2-2 1.5-.9 3.6-1.4 6.2-1.4h.5zM231.4 2.1c0 1.1-.9 2.1-2.1 2.1-1.1 0-2.1-.9-2.1-2.1 0-1.1.9-2.1 2.1-2.1 1.2 0 2.1.9 2.1 2.1zm-3.7 26.6V7.3h3.3v21.5h-3.3zM250.8 8.7V7.4h3.3V28c0 2.5-.8 4.6-2.4 6-1.6 1.4-3.7 2.1-6.5 2.1h-.5c-2 0-3.7-.4-5.1-1.1-1.5-.8-2.5-2-3.2-3.5l3-1.2c.3.9.9 1.4 1.7 1.9.9.5 2.1.7 3.6.7h.5c1.9 0 3.4-.4 4.3-1.2.9-.8 1.3-2 1.3-3.5v-.7c-1.4.9-3.3 1.4-5.6 1.4-2.7 0-4.9-.7-6.4-2.1-1.6-1.4-2.5-3.5-2.5-6v-5.5c0-2.5.9-4.6 2.5-6 1.6-1.4 3.7-2.1 6.4-2.1 2.3.1 4.2.5 5.6 1.5zm-9.9 3.1c-.9.8-1.3 1.9-1.3 3.5v5.5c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2s3.4-.5 4.3-1.2c.9-.8 1.3-2 1.3-3.5v-5.5c0-1.6-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2-1.9-.1-3.4.4-4.3 1.2zM275.3 9.3c1.6 1.4 2.4 3.4 2.4 6v13.5h-3.3V15.3c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.4.4-4.3 1.2c-.9.8-1.3 2-1.3 3.5v13.5h-3.3V7.3h3.3v1.4c1.5-.9 3.4-1.4 5.6-1.4 2.7 0 4.9.7 6.5 2zM304.4 0c2.3 0 4.4.6 5.9 1.7 1.6 1.1 2.7 2.8 3.4 5l-3.2.9c-.4-1.4-1.1-2.5-2.1-3.2-1-.7-2.4-1.1-4-1.1h-.5c-2.2 0-3.9.5-5 1.3-1 .8-1.5 1.9-1.5 3.4s.5 2.6 1.5 3.4c1.1.9 2.9 1.3 5 1.3 3 0 5.4.7 7.1 2 1.8 1.4 2.8 3.4 2.8 6 0 2.5-1 4.6-2.8 6-1.7 1.4-4.1 2-7.1 2h-.5c-2.3 0-4.4-.6-6-1.7-1.6-1.1-2.7-2.8-3.3-4.9l3.1-.9c.4 1.4 1.1 2.5 2.1 3.2 1 .7 2.4 1.1 4 1.1h.5c2.2 0 4-.5 5-1.3s1.5-1.9 1.5-3.4-.5-2.6-1.5-3.4c-1.1-.9-2.8-1.3-5-1.3-3 0-5.3-.7-7.1-2-1.8-1.4-2.8-3.4-2.8-6s.9-4.6 2.8-6c1.7-1.3 4.1-2 7.1-2h.6zM336.1 28c0 2.5-.9 4.6-2.5 6-1.6 1.4-3.7 2.1-6.4 2.1h-.5c-2 0-3.7-.4-5.1-1.1-1.5-.8-2.5-2-3.2-3.5l3-1.2c.3.9.9 1.4 1.7 1.9.9.5 2.1.7 3.6.7h.5c1.9 0 3.4-.4 4.3-1.2.9-.8 1.3-2 1.3-3.5v-.7c-1.5.9-3.4 1.4-5.6 1.4-2.8 0-4.9-.7-6.5-2.1-1.6-1.4-2.4-3.5-2.4-6V7.3h3.3v13.5c0 1.5.4 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2s3.4-.5 4.3-1.2c.9-.8 1.3-2 1.3-3.5V7.3h3.3V28zM350.4 7.3c2 0 3.7.4 5.1 1.1 1.5.8 2.5 2 3.2 3.5l-3 1.2c-.3-.9-.9-1.4-1.7-1.9-.9-.5-2.1-.7-3.6-.7h-.5c-2.5 0-3.8.5-4.5.9-.8.5-1.1 1.1-1.1 2 0 .9.3 1.5 1.1 2 .7.4 2 .9 4.5.9 2.6 0 4.8.5 6.3 1.4.8.5 1.5 1.2 2 2s.7 1.8.7 2.8c0 1-.2 1.9-.7 2.8-.5.8-1.1 1.5-2 2-1.5.9-3.7 1.4-6.3 1.4h-.5c-2 0-3.7-.4-5.1-1.1-1.5-.8-2.5-2-3.2-3.5l3-1.2c.3.9.9 1.4 1.7 1.9.9.5 2.1.7 3.6.7h.5c2.5 0 3.9-.5 4.5-.9.8-.5 1.1-1.1 1.1-2 0-.9-.3-1.5-1.1-2-.7-.4-2-.9-4.5-.9-2.6 0-4.7-.5-6.2-1.4-.9-.5-1.5-1.2-2-2s-.7-1.8-.7-2.8c0-1 .2-1.9.7-2.8.5-.8 1.1-1.5 2-2 1.5-.9 3.6-1.4 6.2-1.4h.5zM373.5 7.3v3.3h-5.6v10.2c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2v3.3c-2.8 0-4.9-.7-6.5-2.1-1.6-1.4-2.4-3.4-2.4-6V10.5h-2.9V7.3h2.9V0h3.3v7.3h5.6zM392.6 9.3c1.6 1.4 2.4 3.4 2.4 6v4.4h-14.5v1.1c0 1.5.5 2.7 1.3 3.5.9.8 2.4 1.2 4.3 1.2h.5c1.5 0 2.7-.2 3.6-.7.8-.5 1.4-1 1.7-1.9l3 1.2c-.6 1.6-1.7 2.8-3.2 3.5-1.4.8-3.1 1.1-5.1 1.1h-.5c-2.7 0-4.9-.7-6.4-2.1-1.6-1.4-2.5-3.4-2.5-6v-5.5c0-2.5.9-4.6 2.5-6 1.6-1.4 3.7-2.1 6.4-2.1 2.8.3 5 1 6.5 2.3zm-10.8 2.5c-.9.8-1.3 2-1.3 3.5v1.1h11.2v-1.1c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2-1.8-.1-3.3.4-4.3 1.2zM429.9 9.3c1.6 1.4 2.5 3.4 2.5 6v13.5h-3.3V15.3c0-1.5-.5-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.4.4-4.3 1.2c-.9.8-1.4 2-1.4 3.5v13.5h-3.3V15.3c0-1.5-.4-2.7-1.3-3.5-.9-.8-2.4-1.2-4.3-1.2s-3.4.4-4.3 1.2c-.9.8-1.3 2-1.3 3.5v13.5H400V7.3h3.3v1.4c1.5-.9 3.4-1.4 5.6-1.4 2.7 0 4.9.7 6.5 2.1.3.2.5.5.8.8.2-.3.5-.6.8-.8 1.6-1.4 3.7-2.1 6.5-2.1 2.7 0 4.9.7 6.4 2z\" fill=\"var(--dark)\" stroke=\"var(--dark)\"/></svg>";
})();