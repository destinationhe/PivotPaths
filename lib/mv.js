var SPEED = 1500;
var TYPES = {
    '-2': 'search',
    '-1': 'search',
    '0': 'author',
    '1': 'item',
    '2': 'tag'
};
var morelabels = ['authors', 'papers', 'keywords'];
var SQRTTWO = Math.sqrt(2);
var TITLE = 'PivotPaths';
var EMAIL = "md@mariandoerk.de";
var DEFAULT_ORDER = 1;
var BASEURL = document.URL.replace("index.html", "").split("#")[0];
var LAYOUTRUNS = 10;
var MOVETIMEOUT = 1000 * 60;
var PLAYTIMEOUT = 1000 * 10;
var ZOOMSTEP = 0.25;
var PUBTYPE = 0;
if (PUBTYPE == 0) {
    var ITEMSUP = 1;
    var ITEMSRIGHT = .25;
    var ACORRECT0 = 0;
    var ACORRECT1 = 1.5;
    var ACORRECT2 = -1.5;
    var PUBSBY = "publications by";
    var PUBSRE = "references in / citations of";
    var PABOUT = "publications about";
    var FINDHINT = 'Find author, paper or keyword';
    var PUBNAME = " publications ";
    var PUBCITES = " citations ";
} else if (PUBTYPE == 1) {
    var ITEMSUP = -1.5;
    var ITEMSRIGHT = 1.5;
    var ACORRECT0 = 0;
    var ACORRECT1 = 2;
    var ACORRECT2 = .5;
    var PUBSBY = "movies with";
    var PUBSRE = "related movies";
    var PABOUT = "movies about";
    var FINDHINT = 'Find actor, movie or genre';
    var PUBNAME = " movies ";
    var PUBCITES = " = critic's score";
} else if (PUBTYPE == 2) {
    var ITEMSUP = -1.5;
    var ITEMSRIGHT = 1.5;
    var ACORRECT0 = 0;
    var ACORRECT1 = 2;
    var ACORRECT2 = .5;
    var PUBSBY = "videos with";
    var PUBSRE = "related videos";
    var PABOUT = "videos about";
    var FINDHINT = 'Find YouTube user, video or tag';
    var PUBNAME = " videos ";
    var PUBCITES = " views ";
    var PUBREFS = " favorites ";
} else if (PUBTYPE == 3) {
    var ITEMSUP = 1;
    var ITEMSRIGHT = 1;
    var ACORRECT0 = 0;
    var ACORRECT1 = 1.5;
    var ACORRECT2 = -1.5;
    var PUBSBY = "news stories by";
    var PUBSRE = "news related to ";
    var PABOUT = "news about";
    var FINDHINT = 'Find author, news article or topic';
    var PUBNAME = " news stories ";
    var PUBCITES = " references ";
}
var ICONWIDTH = 20;
var LASSOWIDTH = 2;
var BASEFONT = 11;
var ADJUSTFONT = true;
var FONTMIN = 11;
var FONTMAX = 22;
var FONTFACTOR = 1.25;
var ANCHORMARGIN = 0;
var CSSTRANS = $('html').hasClass('csstransitions');
var LISTLAYOUT = false;
var SORTBYTIME = false;
var TILTEDTITLES = true;
var EMPHASES = true;
var OMITANCHORS = true;
var MINEMPHASIS = 0.2;
var LIMITMIN = 15;
var LIMITMAX = 45;
var EMBEDANCHORS = false;
var ICONANCHORED = false;
var DRAWEDGES = true;
var ACROSSFAC = true;
var WITHINFAC = false;
var ASTROKE1 = '#D5E6EC';
var ASTROKE2 = '#2B74B3';
var TSTROKE1 = '#F4E2E5';
var TSTROKE2 = '#BA4353';
var ISTROKE1 = '#E3ECD5';
var ISTROKE2 = '#51984C';
if (false) {
    ASTROKE1 = '#BFD8EA';
    ASTROKE2 = '#10478E';
    TSTROKE1 = '#EDD1D7';
    TSTROKE2 = '#77111E';
    ISTROKE1 = '#D5E3BB';
    ISTROKE2 = '#30611D';
}
var STROKEW0 = 1;
var STROKEW1 = 1;
var STROKEW2 = 2;
var STROKEW3 = 10;
var EDGEOPAC = 0;

function View(div) {
    var R = Raphael(div);
    this.init = function () {
        if (PUBTYPE == 0) {
            $("#order").append('<select id="order_left"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most cited</option><option value="3">random</option></select>');
            $("#order").append('<select id="order_right"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most cited</option><option value="3">random</option></select>');
        } else if (PUBTYPE == 1) {
            $("#order").append('<select id="order_left"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most praised&nbsp;&nbsp;&nbsp;</option><option value="3">random</option></select>');
            $("#order").append('<select id="order_right"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most praised</option><option value="3">random</option></select>');
        } else if (PUBTYPE == 2) {
            $("#order").append('<select id="order_left"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most viewed&nbsp;&nbsp;&nbsp;</option><option value="3">random</option></select>');
            $("#order").append('<select id="order_right"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most viewed</option><option value="3">random</option></select>');
        } else if (PUBTYPE == 3) {
            $("#order").append('<select id="order_left"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most viewed</option><option value="3">random</option></select>');
            $("#order").append('<select id="order_right"><option value="0">most recent&nbsp;&nbsp;&nbsp;</option><option value="1">most viewed</option><option value="3">random</option></select>');
        }
        this.mode = 0;
        this.width = $(window).width();
        this.height = $(window).height();
        R.setSize(this.width, this.height);
        this.sessionID = this.session();
        this.feedbacked = false;
        this.abouttoleave = false;
        this.autoplay = false;
        this.playtime = null;
        this.movetime = null;
        this.fontsize = this.interval(this.width * this.height, 800 * 600, 2560 * 1600, FONTMIN, FONTMAX, false);
        this.topmargin = this.fontsize * 3;
        this.margin = this.fontsize * 2;
        $("#buttons").css({
            'font-size': this.fontsize + 3
        });
        this.limit = Math.floor(this.interval(this.width * this.height, 800 * 600, 2560 * 1600, LIMITMIN, LIMITMAX, true));
        this.authors = {};
        this.items = {};
        this.tags = {};
        this.anchors = {};
        this.all = {};
        this.left = '';
        this.right = '';
        this.order = DEFAULT_ORDER;
        this.offset = 0;
        this.leftPoints = {};
        this.rightPoints = {};
        this.leftSearch = '';
        this.rightSearch = '';
        this.emphases = [1, 1, 1];
        this.backs = [];
        this.edges = {};
        this.lasso = null;
        this.events();
        this.parseHash(window.location.hash);
        this.searchTerm = "";
        this.searchCursor = 0;
        this.searchLength = 0;
        this.altkey = false;
        this.runs = 0;
        var that = this;
        $.address.externalChange(function (obj) {
            that.log(4);
            that.parseHash(obj.value);
        });
        $("#loading div").css({
            "margin-top": this.height / 2.75
        });
        $("#helpoverlay div").css({
            "margin-top": (this.height - 500) / 2
        });
        return this;
    };
    this.log = function (type, fid) {
        return;
        this.abouttoleave = false;
        if (typeof fid === "undefined") fid = "0";
        var q = type + ":" + fid + ":" + this.width + ":" + this.height;
        jQuery.getJSON("log?" + q);
    }
    this.session = function () {
        var readCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
        var coo = readCookie('ppid');
        return coo;
    }
    this.events = function () {
        var that = this;
        if (that.autoplay) $("*").mousemove(function () {
            clearTimeout(that.movetime);
            clearTimeout(that.playtime);
            that.autoplay = false;
            that.playtime = setTimeout(function () {
                that.play(that);
            }, MOVETIMEOUT);
        });
        $('body *').select(function () {
            return false;
        });
        $(window).unbind();
        $(window).unbind().bind('beforeunload', function () {
            return;
            if (that.feedbacked == false) {
                that.abouttoleave = true;
                that.showDropdown('feedback');
                return 'Thank you for trying out PivotPaths.\n\nWe would really appreciate your feedback. Please stay on this page and click "Send email" in the upper right corner.';
            }
        });
        $("#help").unbind().click(function () {
            that.showHelp();
        });
        $("#share").unbind().click(function () {
            that.showDropdown("share");
        });
        $("#feedback").unbind().click(function () {
            that.showDropdown("feedback");
        });
        $("#order_left,#order_right").unbind().change(function () {
            that.order = Number($(this).val());
            $("#order_left,#order_right").val(that.order);
            that.hideEdges();
            that.query();
        });
        $('#canvas, #buttons, #cap select, #meta').unbind().click(function () {
            that.hideDetail();
        });
        $(window).keyup(function (e) {
            if (e.which == 27 && that.abouttoleave == false) {
                $("#search").val("");
                that.pivot();
                that.writeHistory();
            }
        });
        $('.back').unbind();
        $(".back").wheel(function (e, d) {
            var type = $(this).attr('id').split('back')[1];
        });
        var last = new Date().getTime();
        var timeout = null;
        $(window).resize(function (e) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                that.log(9);
                that.redraw();
            }, SPEED / 2);
        });
        this.drawLasso();
        $("#labels div").removeClass("active fr to");
        $("#labels div").unbind();
        $("#labels div").not('.more').mouseenter(function (e) {
            var fid = $(this).attr('id');
            view.hover(fid);
            $("#labels div").mousemove(function (e) {
                var pos = $(this).position();
                var w = $(this).width();
                var ix = pos.left;
                var ex = e.pageX;
                var fid = $(this).attr('id');
                if (ex - ix < ICONWIDTH) {
                    $(this).addClass('detailIcon');
                    $("#" + fid).attr({
                        title: 'Details'
                    });
                } else $(this).removeClass('detailIcon');
                if ($(this).hasClass('anchor')) {
                    if (ix + w - ex < ICONWIDTH) $(this).addClass('deleteCross').attr({
                        title: 'Remove filter'
                    });
                    else $(this).removeClass('deleteCross');
                } else if ($('body').hasClass('mode1') || $('body').hasClass('mode3')) {
                    if (ix + w - ex < ICONWIDTH) $(this).addClass('compareArrow').attr({
                        title: 'Compare'
                    });
                    else $(this).removeClass('compareArrow');
                }
                if (ix + w - ex > 20 && ex - ix > ICONWIDTH) {
                    var fid = $(this).attr('id');
                    fid = fid.split("_");
                    if (fid[0] == '1') {
                        if (typeof view.items[fid[1]] !== "undefined") {
                            var name = view.items[fid[1]].name;
                            var year = view.items[fid[1]].year;
                            var title = name + " (" + year + ")";
                            $(this).attr({
                                title: title
                            });
                        }
                    } else $(this).attr({
                        title: null
                    });
                }
            });
        });
        $("#labels div").not('.more').mouseleave(function (e) {
            view.hover();
            $("#labels div").unbind('mousemove');
            $(this).removeClass('compareArrow detailIcon');
        });
        $("#labels div").not('.more').mousedown(function (e) {
            e.preventDefault();
            $(this).addClass('active fr');
            if (!$(this).hasClass('item')) $(window).mousemove(function (e) {
                $("#labels div").unbind('mouseenter');
                view.hover();
                $("#labels div").not('.more').mouseenter(function (e) {
                    if ($('.fr').attr('id') == $(this).attr('id')) {
                        return false;
                    }
                    $("#labels div").removeClass('active');
                    $('.fr').addClass('active');
                    $(this).addClass('active to');
                    $(this).mouseleave(function (e) {
                        $(this).removeClass('active to');
                    });
                });
                view.drawLasso(e.pageX, e.pageY);
            });
            var type = 'author';
            if ($(this).hasClass('item')) {
                type = 'item';
            } else if ($(this).hasClass('tag')) {
                type = 'tag';
            }
            $("#labels div").not('.more').mouseup(function (e) {
                var to_id = $(this).attr('id');
                var fr_id = $('.fr').attr('id');
                if (to_id == fr_id) {
                    $(window).unbind();
                    if ($(this).hasClass('detailIcon')) {
                        var fid = $(this).attr('id');
                        var it = view.all[fid];
                        var link = "";
                        view.showDetail(fid);
                        $(this).removeClass('active fr');
                        view.events();
                        $(this).trigger('mouseenter');
                    } else if ($(this).hasClass('compareArrow') && view.left !== "") {
                        $("#labels div").removeClass("fr to");
                        if (view.right === "") var to_old = view.left;
                        else var to_old = view.right;
                        $("#" + to_old).addClass('fr');
                        $("#" + to_id).addClass('to');
                        $('.search').remove();
                        $('.anchor').removeClass('anchor');
                        $('.to,.fr').addClass('anchor');
                        view.pivot(to_old, to_id);
                        view.events();
                    } else {
                        $("#labels div").removeClass("fr to");
                        $("#" + fr_id).addClass('fr');
                        $("#" + to_id).addClass('to');
                        $('.search').remove();
                        $('.anchor').removeClass('anchor');
                        if ($(this).hasClass('deleteCross')) {
                            if (to_id == view.left) to_id = view.right;
                            else to_id = view.left;
                            $(this).removeClass('deleteCross');
                        }
                        $("#" + to_id).addClass('anchor');
                        view.pivot(to_id);
                        view.events();
                    }
                } else {
                    if (!$(this).hasClass('item') && !$('.fr').hasClass('item')) {
                        $(window).unbind();
                        view.pivot(fr_id, to_id);
                    } else {
                        that.drawLasso();
                        that.events();
                        $(".fr").removeClass('fr');
                    }
                }
                return false;
            });
            $(window).mouseup(function (e) {
                view.events();
            });
            return false;
        });
    };
    this.redraw = function () {
        this.width = $(window).width();
        this.height = $(window).height();
        $("#loading div").css({
            "top": this.height / 2.75
        });
        $("#helpoverlay div").css({
            "margin-top": (this.height - 500) / 2
        });
        this.hideEdges(false);
        this.hideDetail();
        this.hideDropdown("feedback");
        this.hideDropdown("share");
        this.fontsize = this.interval(this.width * this.height, 800 * 600, 2560 * 1600, FONTMIN, FONTMAX, false);
        this.topmargin = this.fontsize * 3;
        this.margin = this.fontsize * 2;
        this.limit = Math.floor(this.interval(this.width * this.height, 800 * 600, 2560 * 1600, LIMITMIN, LIMITMAX, true));
        $("#buttons").css({
            'font-size': this.fontsize + 3
        });
        R.setSize(this.width, this.height);
        $("#meta div, #order select").css({
            opacity: 0
        });
        this.hover();
        if (this.mode == 0) this.searchDisplay(true);
        else this.query();
    };
    this.icon = function (left, type) {
        if (left) {
            if (type == 0) $("#favicon").attr("href", "favicons/author.png");
            else if (type == 1) $("#favicon").attr("href", "favicons/item.png");
            else if (type == 2) $("#favicon").attr("href", "favicons/tag.png");
        } else $("#favicon").attr("href", "favicons/search.png");
    }
    this.pivot = function (left, right) {
        $("#cap div").css({
            opacity: 0
        });
        window.scrollBy(0, -100);
        this.hideDetail();
        this.hideHelp();
        this.hideDropdown("feedback");
        this.hideDropdown("share");
        this.abouttoleave = false;
        if (typeof left === "undefined") {
            left = '';
        }
        if (typeof right === "undefined") {
            right = '';
        }
        var leftType = Number(('' + left).split("_")[0]);
        var rightType = Number(('' + right).split("_")[0]);
        var mode = -1;
        if (left === "" && right === "") mode = 0;
        else if (left !== "" && right === "" && leftType !== 1) mode = 1;
        else if (left !== "" && right === "" && leftType === 1) mode = 2;
        else if (left !== "" && right !== "") mode = 3;
        $('body').removeClass('mode0 mode1 mode2 mode3').addClass('mode' + mode);
        this.left = left;
        this.right = right;
        if (left === '' || (leftType != -1 && leftType != -2)) {
            this.leftSearch = "";
        }
        if (right === '' || (rightType != -1 && rightType != -2)) {
            this.rightSearch = "";
        }
        if (this.mode != mode) this.removeElement($('.more'));
        this.mode = mode;
        this.offset = 0;
        if (mode === 0) {
            this.removeElement($(".search, .anchor"));
            $("#share").css({
                opacity: 0
            });
            this.sync();
            this.search();
        } else {
            $("#share").css({
                opacity: 1
            });
            this.search();
            this.query();
        }
    };
    this.drawLasso = function (toX, toY) {
        if (typeof toX === "undefined" && typeof toY === "undefined") {
            if (this.lasso != null) {
                this.lasso.remove();
                this.lasso = null;
            }
            return;
        }
        var fr = $("div.fr");
        var frpos = fr.position();
        var frX = frpos.left + fr.width() / 2;
        var frY = frpos.top + fr.height() / 2;
        var to = $("div.to");
        var type = Number(fr.attr('id').split("_")[0]);
        var color = this.getColor(type);
        var path = 'M' + frX + ' ' + frY + 'L' + toX + ' ' + toY;
        if (true || to.length > 0) var opac = 1;
        else var opac = .33;
        var attr = {
            'stroke': color,
            'stroke-width': LASSOWIDTH,
            path: path,
            opacity: opac
        };
        if (this.lasso == null) this.lasso = R.path(path).attr(attr);
        else this.lasso.attr(attr);
    }
    this.play = function (that) {
        that.autoplay = true;
        var options = [];
        for (id in that.authors)
            if (!that.authors[id].hidden && !that.authors[id].anchor) options.push(that.authors[id].fullid)
        for (id in that.items)
            if (!that.items[id].hidden && !that.items[id].anchor) options.push(that.items[id].fullid)
        for (id in that.tags)
            if (!that.tags[id].hidden && !that.tags[id].anchor) options.push(that.tags[id].fullid)
        if (options.length == 0) var fid = "0_497686";
        else var fid = options[Math.floor(Math.random() * options.length)];
        that.hover(fid);
        that.pivot(fid);
    }
    this.sync = function (r) {
        var that = this;
        clearTimeout(this.playtime);
        if (this.autoplay) this.playtime = setTimeout(function () {
            that.play(that);
        }, PLAYTIMEOUT);
        var authors = {};
        var items = {};
        var tags = {};
        var total = [0];
        if (typeof r !== "undefined") {
            authors = r[0];
            items = r[1];
            tags = r[2];
            total = r[3];
        }
        var that = this;
        var diff = function (stale, fresh) {
            for (id in stale) {
                var fid = stale[id].fullid;
                if (typeof fresh[id] === "undefined") {
                    if (stale[id].obj) stale[id].obj.removeClass('hoverShow').addClass('tobedeleted');
                    if (stale[id].obj2) stale[id].obj2.remove();
                    delete stale[id];
                    delete that.all[fid];
                } else {
                    var obj = stale[id].obj;
                    var obj2 = stale[id].obj2;
                    fresh[id].obj = obj;
                    fresh[id].obj2 = obj2;
                    stale[id] = fresh[id];
                    stale[id].diff = 0;
                }
            }
            setTimeout(function () {
                $(".tobedeleted").remove();
            }, SPEED * 1.5);
            for (id in fresh) {
                var fid = fresh[id].fullid;
                stale[id] = fresh[id];
                stale[id].diff = 1;
                that.all[fid] = fresh[id];
            }
            for (id in that.all) {
                var it = that.all[id];
                var fid = it.fullid;
                if (fid == that.left || fid == that.right) it.anchor = true;
                else it.anchor = false;
            }
        }
        that.total = total;
        diff(this.authors, authors);
        diff(this.items, items);
        diff(this.tags, tags);
    }
    this.draw = function (it) {
        var fid = it.fullid;
        var id_ = "_" + fid
        var cl = TYPES[it.type];
        var name = this.getShortName(it);
        return "<div class='" + cl + "' id='" + id_ + "'><span>" + name + "</span></div>";
    }
    this.updateLabel = function (it) {
        if (typeof it === "undefined") return;
        var shortname = this.getShortName(it);
        if (typeof it.obj !== "undefined") it.obj.find("span").html(shortname);
        if (typeof it.obj2 !== "undefined") it.obj2.find("span").html(shortname);
    }
    this.display = function (items, animate) {
        if (typeof animate === "undefined") animate = true;
        $('.cursor').removeClass('cursor');
        $('.noani').removeClass('noani');
        for (key in items) {
            var it = items[key];
            var fid = it.fullid;
            if (it.hidden) {
                if (typeof it.obj !== "undefined") {
                    this.removeElement(it.obj);
                    this.removeElement(it.obj2);
                    delete it.obj;
                    delete it.obj2;
                }
            } else {
                if (typeof it.trans === "undefined") it.trans = 'rotate(0deg)';
                var opac = .3;
                if (it.cnt > 1) opac - 1;
                var css = {
                    left: it.p1[0],
                    top: it.p1[1],
                    opacity: 0,
                    'font-size': it.fs,
                    '-webkit-transform': it.trans,
                    '-webkit-transform-origin': 'left center',
                    '-moz-transform': it.trans,
                    '-moz-transform-origin': 'left center',
                    '-ms-transform': it.trans,
                    '-ms-transform-origin': 'left center',
                    '-o-transform': it.trans,
                    '-o-transform-origin': 'left center',
                    'transform': it.trans,
                    'transform-origin': 'left center'
                };
                if (typeof it.obj === "undefined") {
                    $("#" + fid).remove();
                    if (typeof it.obj2 !== "undefined") {
                        it.obj2.clone().attr({
                            id: fid
                        }).appendTo('#labels');
                    }
                    it.obj = $("#" + fid).addClass('noani');
                    it.obj.css(css);
                    it.obj.removeClass('noani');
                    if (this.runs <= 1 || this.mode === 0) it.obj.css({
                        opacity: 1
                    });
                    else setTimeout((function (obj) {
                        return function (bar) {
                            if (typeof obj !== "undefined") obj.css({
                                opacity: 1
                            });
                        };
                    })(it.obj), SPEED);
                } else {
                    css.opacity = 1;
                    if (it.type == 1) {
                        var shortname = this.getShortName(it)
                        it.obj.find("span").html(shortname);
                        it.obj2.find("span").html(shortname);
                    }
                    if (this.runs <= 1) it.obj.css(css);
                    else setTimeout((function (obj, css) {
                        return function () {
                            if (typeof obj !== "undefined") obj.css(css);
                        };
                    })(it.obj, css), SPEED / 2);
                }
            }
        }
    }
    this.hideEdges = function (animate) {
        var that = this;
        if (typeof animate === "undefined") animate = true;
        for (eid in this.edges) {
            if (animate) this.edges[eid].attr({
                opacity: 0
            });
            else {
                this.edges[eid].remove();
                delete this.edges[eid];
            }
        }
        if (animate) setTimeout(function () {
            for (eid in that.edges) {
                that.edges[eid].remove();
                delete that.edges[eid];
            }
        }, 500);
    }
    this.drawEdges = function (animate) {
        if (typeof animate === "undefined") animate = true;
        if (DRAWEDGES === false) return;
        var that = this;
        R.clear();
        var magnets = function (a, b) {
            if (a.hidden || b.hidden) {
                return false;
            }
            var vertical = true;
            var ordered = true;
            var leftside = false;
            var rightside = false;
            var a_anch = that.isAnchor(a);
            var b_anch = that.isAnchor(b);
            var a_side = that.getSide(a);
            var b_side = that.getSide(b);
            var a_type = a.type;
            var b_type = b.type;
            if (a_anch > -1 && b_anch > -1) {
                vertical = false;
                if (a_anch === 1 && b_anch === 0) ordered = false;
                if (OMITANCHORS) return false;
            } else if (a_anch > -1) {
                if (OMITANCHORS) return false;
                vertical = false;
                if (a_anch === 0) {
                    if (that.mode === 3 && b.sim === 0) ordered = false;
                } else {
                    if (that.mode === 3 && b.sim < 1) ordered = false;
                }
            } else if (b_anch > -1) {
                if (OMITANCHORS) return false;
                vertical = false;
                if (b_anch === 0) {
                    if (that.mode === 1 || a.sim > 0) ordered = false;
                } else {
                    if (that.mode === 1 || a.sim === 1) ordered = false;
                }
            } else if (a_side === b_side) {
                if (a_type > b_type) ordered = false;
                if (a_side === -1) leftside = true;
                else if (a_side === 1) rightside = true;
            } else {
                vertical = false;
                if (a_side > b_side) ordered = false;
            }
            if (ordered === false) {
                var c = a;
                a = b;
                b = c;
            }
            var p1 = [];
            var p2 = [];
            var off = 50;
            if (leftside) {
                p1 = [a.p1[0], a.p[1]];
                p4 = [b.p1[0], b.p[1]];
                off = Math.abs(p4[1] - p1[1]) / 10;
                p2 = [a.p1[0] - off, a.p[1]];
                p3 = [b.p1[0] - off, b.p[1]];
            } else if (rightside) {
                p1 = [a.p2[0], a.p[1]];
                p4 = [b.p2[0], b.p[1]];
                off = Math.abs(p4[1] - p1[1]) / 10;
                p2 = [a.p2[0] + off, a.p[1]];
                p3 = [b.p2[0] + off, b.p[1]];
            } else if (vertical) {
                if (ICONANCHORED) {
                    var iff = 9;
                    p1 = [a.p1[0] + iff, a.p2[1]];
                    p4 = [b.p1[0] + iff, b.p1[1]];
                    off = 20 + Math.abs(p4[1] - p1[1]) / 4;
                    p2 = [a.p1[0] + iff, a.p2[1] + off];
                    p3 = [b.p1[0] + iff, b.p1[1] - off];
                } else {
                    p1 = [a.p[0], a.p2[1]];
                    p4 = [b.p[0], b.p1[1]];
                    off = 20 + Math.abs(p4[1] - p1[1]) / 4;
                    p2 = [a.p[0], a.p2[1] + off];
                    p3 = [b.p[0], b.p1[1] - off];
                }
            } else {
                p1 = [a.p2[0], a.p[1]];
                p4 = [b.p1[0], b.p[1]];
                off = 20 + Math.abs(p4[0] - p1[0]) / 4;
                p2 = [a.p2[0] + off, a.p[1]];
                p3 = [b.p1[0] - off, b.p[1]];
            }
            return [p1, p2, p3, p4];
        }
        var withinFacetEdges = function () {
            for (id in that.items) {
                var it = that.items[id];
                if (it.hidden || it.anchor) continue;
                for (id2 in it.cites_) {
                    var it2 = that.items[id2];
                    if (it2.hidden || it2.anchor) continue;
                    var attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: ISTROKE1,
                        cursor: 'pointer',
                        opacity: 0
                    };
                    if (typeof it2 !== "undefined") {
                        var eid = it.fullid + "__" + it2.fullid;
                        var p = [it.p, it.p, it2.p, it2.p];
                        var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                        that.edges[eid] = R.path(path).attr(attr);
                        that.edges[eid].color1 = ISTROKE1;
                        that.edges[eid].color2 = ISTROKE2;
                    }
                }
            }
            for (id in that.tags) {
                var it = that.tags[id];
                if (it.hidden || it.anchor) continue;
                for (id2 in it.tags) {
                    var it2 = that.tags[id2];
                    if (it2.hidden || it2.anchor || Number(id2) < Number(id)) continue;
                    var attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: TSTROKE1,
                        cursor: 'pointer',
                        opacity: 0
                    };
                    if (typeof it2 !== "undefined") {
                        var eid = it.fullid + "__" + it2.fullid;
                        var p = [it.p, it.p, it2.p, it2.p];
                        var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                        that.edges[eid] = R.path(path).attr(attr);
                        that.edges[eid].color1 = TSTROKE1;
                        that.edges[eid].color2 = TSTROKE2;
                    }
                }
            }
            for (id in that.authors) {
                var it = that.authors[id];
                if (it.hidden || it.anchor) continue;
                for (id2 in it.authors) {
                    var it2 = that.authors[id2];
                    if (it2.hidden || it2.anchor || Number(id2) < Number(id)) continue;
                    var attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: ASTROKE1,
                        cursor: 'pointer',
                        opacity: 0
                    };
                    if (typeof it2 !== "undefined") {
                        var eid = it.fullid + "__" + it2.fullid;
                        var p = [it.p, it.p, it2.p, it2.p];
                        var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                        that.edges[eid] = R.path(path).attr(attr);
                        that.edges[eid].color1 = ASTROKE1;
                        that.edges[eid].color2 = ASTROKE2;
                    }
                }
            }
        }
        var acrossFacetEdges = function () {
            for (id in that.items) {
                var it = that.items[id];
                for (aid in it.authors) {
                    var au = that.authors[aid];
                    var au_attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: ASTROKE1,
                        cursor: 'pointer',
                        opacity: 0
                    };
                    if (typeof au !== "undefined") {
                        var eid = it.fullid + "__" + au.fullid;
                        var p = magnets(it, au);
                        if (p !== false) {
                            var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                            that.edges[eid] = R.path(path).attr(au_attr);
                            that.edges[eid].color1 = ASTROKE1;
                            that.edges[eid].color2 = ASTROKE2;
                        }
                    }
                }
                for (tid in it.tags) {
                    var ta = that.tags[tid];
                    var ta_attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: TSTROKE1,
                        cursor: 'pointer',
                        opacity: 0
                    };
                    if (typeof ta !== "undefined") {
                        var eid = it.fullid + "__" + ta.fullid;
                        var p = magnets(it, ta);
                        if (p !== false) {
                            var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                            that.edges[eid] = R.path(path).attr(ta_attr);
                            that.edges[eid].color1 = TSTROKE1;
                            that.edges[eid].color2 = TSTROKE2;
                        }
                    }
                }
            }
        }
        var tiltedTitleEdges = function () {
            for (id in that.items) {
                var it = that.items[id];
                if (it.hidden) continue;
                for (aid in it.authors) {
                    var au = that.authors[aid];
                    if (typeof au === "undefined" || au.hidden || au.anchor) continue;
                    var au_attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: ASTROKE1,
                        opacity: 0
                    };
                    if (typeof au !== "undefined") {
                        var eid = it.fullid + "__" + au.fullid;
                        var p0 = [au.p[0], au.p2[1]];
                        if (it.anchor) var p3 = [it.p[0], it.p1[1] + 2];
                        else var p3 = [it.p1[0], it.p[1] + 2];
                        var l = p3.dist(p0) / 4;
                        var s = Math.sqrt(l * l / 2);
                        var p1 = [p0[0], p0[1] + l];
                        if (it.anchor) var p2 = [p3[0], p3[1] - s * 2];
                        else var p2 = [p3[0] - s, p3[1] - s];
                        var p = [p0, p1, p2, p3];
                        if (p !== false) {
                            var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                            that.edges[eid] = R.path(path).attr(au_attr);
                            that.edges[eid].color1 = ASTROKE1;
                            that.edges[eid].color2 = ASTROKE2;
                        }
                    }
                }
                for (tid in it.tags) {
                    var ta = that.tags[tid];
                    if (typeof ta === "undefined" || ta.hidden || ta.anchor) continue;
                    var ta_attr = {
                        opacity: EDGEOPAC,
                        'stroke-width': STROKEW1,
                        stroke: TSTROKE1,
                        opacity: 0
                    };
                    if (typeof ta !== "undefined") {
                        var eid = it.fullid + "__" + ta.fullid;
                        var w = it.obj2.width();
                        var d = Math.sqrt(w * w / 2);
                        if (it.anchor) var p0 = [it.p[0], it.p2[1] + 2];
                        else var p0 = [it.p1[0] + d, it.p[1] + d + 2];
                        var p3 = [ta.p[0], ta.p1[1]];
                        var l = p0.dist(p3) / 4;
                        var s = Math.sqrt(l * l / 2);
                        if (it.anchor) var p1 = [p0[0], p0[1] + s * 2];
                        else var p1 = [p0[0] + s, p0[1] + s];
                        var p2 = [p3[0], p3[1] - s];
                        var p = [p0, p1, p2, p3];
                        if (p !== false) {
                            var path = [["M", p[0][0], p[0][1]], ["C", p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]]];
                            that.edges[eid] = R.path(path).attr(ta_attr);
                            that.edges[eid].color1 = TSTROKE1;
                            that.edges[eid].color2 = TSTROKE2;
                        }
                    }
                }
            }
        }
        if (TILTEDTITLES) tiltedTitleEdges();
        else if (ACROSSFAC) acrossFacetEdges();
        if (WITHINFAC || this.emphases[0] == 3 || this.emphases[2] == 3) withinFacetEdges();
        setTimeout(function () {
            for (eid in that.edges) that.edges[eid].attr({
                opacity: 1
            });
        }, 10);
    }
    this.hover = function (fid, fid2) {
        if (typeof fid !== 'undefined' && typeof this.all[fid] !== 'undefined' && this.all[fid].anchor && fid.charAt(0) != 1 && typeof fid2 === 'undefined') return;
        if (this.mode == 0) return;
        if (typeof fid === "undefined") {
            $(".hoverShow").removeClass('hoverShow active');
            $(".hoverHide").removeClass('hoverHide');
            for (eid in this.edges) {
                this.edges[eid].attr({
                    stroke: this.edges[eid].color1,
                    'stroke-width': STROKEW1
                });
            }
        } else {
            if (typeof this.all[fid] !== "undefined") {
                var it = this.all[fid];
                var all = {};
                if (typeof fid2 === "undefined") {
                    if (typeof it.authors !== "undefined") {
                        for (id in it.authors) {
                            all[0 + "_" + id] = 1;
                        }
                    }
                    if (typeof it.items !== "undefined") {
                        for (id in it.items) {
                            all[1 + "_" + id] = 1;
                        }
                    }
                    if (typeof it.tags !== "undefined") {
                        for (id in it.tags) {
                            all[2 + "_" + id] = 1;
                        }
                    }
                    if (!it.anchor) {
                        if (typeof it.refs_ !== "undefined") {
                            for (id in it.refs_) {
                                all[1 + "_" + id] = 1;
                            }
                        }
                        if (typeof it.cites_ !== "undefined") {
                            for (id in it.cites_) {
                                all[1 + "_" + id] = 1;
                            }
                        }
                    }
                    for (fid2 in all) {
                        $("#" + fid2).addClass('hoverShow');
                    }
                    $("#" + fid + ", #labels .anchor").addClass('hoverShow');
                    var eids = {};
                    for (fid2 in all) {
                        eids[fid + "__" + fid2] = 1;
                        eids[fid2 + "__" + fid] = 1;
                    }
                    for (item_id in it.items) {
                        var it2 = this.items[item_id];
                        if (it.type == 0) {
                            for (tag_id in it2.tags) {
                                var it3 = this.tags[tag_id];
                                eids[it2.fullid + "__" + it3.fullid] = 1
                            }
                        } else if (it.type == 2) {
                            for (tag_id in it2.authors) {
                                var it3 = this.authors[tag_id];
                                eids[it2.fullid + "__" + it3.fullid] = 1
                            }
                        }
                    }
                    for (eid in this.edges) {
                        if (typeof eids[eid] !== "undefined") {
                            this.edges[eid].attr({
                                stroke: this.edges[eid].color2,
                                'stroke-width': STROKEW1
                            }).toFront();;
                        }
                    }
                } else {
                    $("#" + fid).addClass('hoverShow active');
                    $("#" + fid2).addClass('hoverShow active');
                    $("#labels .anchor").addClass('hoverShow');
                    var this_eid = fid + "__" + fid2;
                    for (eid in this.edges) {
                        if (eid === this_eid)
                            this.edges[eid].attr({
                                stroke: this.edges[eid].color2,
                                'stroke-width': STROKEW2
                            }).toFront();
                    }
                }
            }
        }
    }
    this.parseHash = function (hash) {
        if (typeof hash === "undefined") return this.pivot();
        var ha = hash.split("/");
        if (ha.length == 1) this.pivot();
        else {
            ha = ha[1].split("-");
            var ref = ha[1];
            this.log(8, ref);
            ha = ha[0].split(":");
            this.order = Number(ha[0]);
            if (ha.length < 2) this.pivot();
            else if (ha.length == 2) this.pivot(ha[1]);
            else if (ha.length == 3) this.pivot(ha[1], ha[2]);
        }
    }
    this.writeHistory = function () {
        var left = this.left.split("_")
        this.icon(left[1], left[0]);
        if (this.mode == 0) {
            var title = "Search";
            var hash = "";
        } else {
            var title = this.getShortName(this.all[this.left]);
            var hash = this.order + ":" + this.left;
        }
        if (this.mode == 3) {
            title += " and " + this.getShortName(this.all[this.right]);
            hash += ":" + this.right;
        }
        title += "";
        $.address.title(title);
        $.address.value(hash);
        this.icon(this.left, this.leftType);
    }
    this.query = function () {
        var that = this;
        $("#loading").css({
            display: 'block'
        });
        if (this.runs > 1) setTimeout(function () {
            if ($("#loading").is(":visible")) $("#loading").css({
                opacity: 1
            });
        }, SPEED);
        else $("#loading").css({
            opacity: 1
        });
        var order = this.order;
        var limit = this.limit;
        var offset = this.offset;
        if (this.mode === 1) {
            var q = this.left;
            q += "_" + order + "_" + limit + "_" + offset;
            //var script = BASEURL + "results.php?s=" + PUBTYPE + "&q=";
            var script = "http://mariandoerk.de/pivotpaths/demo/" + "results.php?s=" + PUBTYPE + "&q=";
            jQuery.getJSON(script + q, function (r, s) {
                setTimeout(function () {
                    that.hover();
                }, SPEED * 1.5);
                that.sync(r);
                that.writeHistory();
                that.results();
            });
        } else if (this.mode === 2) {
            var q = this.left;
            q += "_" + order + "_" + limit + "_" + offset;
            //var script = BASEURL + "paper.php?s=" + PUBTYPE + "&q=";
            var script = "http://mariandoerk.de/pivotpaths/demo/" + "paper.php?s=" + PUBTYPE + "&q=";
            jQuery.getJSON(script + q, function (r, s) {
                setTimeout(function () {
                    that.hover();
                }, SPEED * 1.5);
                that.sync(r);
                that.writeHistory();
                that.results();
            });
        } else if (this.mode === 3) {
            var l = this.left;
            var r = this.right;
            //var script = BASEURL + "compare.php?s=" + PUBTYPE + "&q=";
            var script = "http://mariandoerk.de/pivotpaths/demo/" + "compare.php?s=" + PUBTYPE + "&q=";
            jQuery.getJSON(script + l + "::" + r + "::" + order + "::" + limit, function (r, s) {
                setTimeout(function () {
                    view.hover();
                }, SPEED * 1.5);
                that.sync(r);
                that.writeHistory();
                that.results();
            });
        }
    }
    this.removeElement = function (el, animate) {
        if (typeof animate === "undefined") animate = true;
        if (animate) {
            el.removeClass('hoverShow').addClass('tobedeleted').css({
                opacity: 0
            });
            setTimeout(function (el) {
                if (typeof el !== "undefined") el.remove();
            }, SPEED * 2, el);
        } else el.remove();
    }
    this.showDetail = function (fid) {
        var that = this;
        if ($("#" + fid).hasClass('currentDetail')) return this.hideDetail();
        this.log(0, fid);
        $(".currentDetail").removeClass('currentDetail');
        $("#" + fid).addClass('currentDetail');
        var idA = fid.split("_");
        var it = this.all[fid];
        if (typeof it === "undefined") return;
        var head = "";
        var cont = "";
        var desc = "";
        var numb = "";
        var link = "";
        $("#detail").removeClass('author item tag').addClass('active');
        if (typeof it === "undefined") console.log(idA);
        else if (it.type == 0) {
            $("#detail").addClass('author');
            var head = it.fullname;
            if (it.photo != '' && it.photo != null) head += "<img src='" + it.photo + "'>";
            if (it.org != '' && it.org != null) cont = it.org;
            if (typeof it.interests !== "undefined" && it.interests !== null) desc += "" + it.interests;
            numb = it.count + PUBNAME;
            if (it.cites != null) numb += "– " + it.cites + PUBCITES;
            if (it.link != '' && it.link != null) link = "<a class='link' target='_blank' href='" + it.link + "'>Personal Website</a> &nbsp; ";
            link += "<a class='bing' target='_blank' href='http://www.bing.com/search?q=" + it.fullname + "'>Bing Search</a> &nbsp; ";
            link += "<a class='mas' target='_blank' href='http://academic.research.microsoft.com/Author/" + it.id + "'>MAS Profile</a>";
        } else if (it.type == 1) {
            $("#detail").addClass('item');
            var head = it.name;
            var cont = "";
            if (PUBTYPE == 1) {
                if (it.img != null) head = "<img src='" + it.img + "'>" + head;
                if (it.container != null && it.container != "") cont += it.container + " ";
                cont += it.year;
            } else if (PUBTYPE == 3) {
                if (it.img != null) head = "<img src='" + it.img + "'>" + head;
                cont += new Date(it.time * 1000).toLocaleDateString()
            } else if (PUBTYPE != 2) {
                if (it.container != null && it.container != "") cont += it.container + " ";
                cont += it.year;
            }
            var desc = ""
            if (it.text != '' && it.text != null) desc += it.text.shorten(200);
            numb = "" + it.cites + PUBCITES;
            if (PUBTYPE == 1) {
                if (it.link != '' && it.link != null) link = "<a class='link' target='_blank' href='" + it.link + "'>View Movie on Rotten Tomatoes</a> &nbsp; ";
            } else if (PUBTYPE == 3) {
                link = "<a class='link' target='_blank' href='" + it.link + "'>Read Full Article at The New York Times</a> ";
                numb = "";
            } else if (PUBTYPE == 2) {
                desc = '<iframe width="280" height="188" src="http://www.youtube.com/embed/' + it.link + '" frameborder="0" allowfullscreen showinfo="0"></iframe>';
                numb += " – " + it.refs + PUBREFS;
                link = "<a class='link' target='_blank' href='http://www.youtube.com/watch?v=" + it.link + "&showinfo=0'>Watch Video on YouTube</a> ";
            } else {
                if (it.link != '' && it.link != null) link = "<a class='link' target='_blank' href='" + it.link + "'>Publisher's Page</a> &nbsp; ";
                link += "<a class='bing' target='_blank' href='http://www.bing.com/search?q=\"" + it.name + "\"'>Bing Search</a> &nbsp; ";
                link += "<a class='mas' target='_blank' href='http://academic.research.microsoft.com/Publication/" + it.id + "'>MAS Page</a>";
            }
        } else if (it.type == 2) {
            $("#detail").addClass('tag');
            var head = it.name;
            if (it.text) var desc = it.text.shorten(200);
            else var desc = "";
            numb = it.count + PUBNAME;
            link = "<a class='link' target='_blank' href='http://en.wikipedia.org/w/index.php?title=Special:Search&search=" + it.name + "'>Wikipedia Page</a> &nbsp; ";
            link += "<a class='bing' target='_blank' href='http://www.bing.com/search?q=" + it.name + "'>Bing Search</a> &nbsp; ";
            link += "<a class='mas' target='_blank' href='http://academic.research.microsoft.com/Keyword/" + it.id + "'>MAS Page</a>";
        }
        $("#detail h1").html(head);
        $("#detail h2").html(cont);
        $("#detail p.desc").html(desc + "");
        $("#detail p.numb").html(numb + "");
        $("#detail p.link").html(link);
        $("#detail").css({
            display: 'block',
            "font-size": this.fontsize
        });
        var pos = $("#" + fid).position();
        var elw = $("#" + fid).width();
        var elh = $("#" + fid).height();
        var olw = $("#detail").width();
        var olh = $("#detail").height();
        if (this.mode == 0) {
            pos.top = pos.top - olh / 2;
            pos.left = pos.left - olw - 30;
        } else {
            if (it.type == 0 && !it.anchor) pos.top = pos.top + elh + 10;
            else pos.top = pos.top - olh - 30;
            pos.left = pos.left + elw / 2 - olw / 2
            if (it.type == 1 && !it.anchor) pos.left -= 50;
            if (pos.left < 0) pos.left = 5;
            else if (pos.left > this.width - olw) pos.left = this.width - olw - 30;
        }
        $("#detail a.link").unbind().click(function () {
            that.log(1, fid);
        });
        $("#detail a.bing").unbind().click(function () {
            that.log(2, fid);
        });
        $("#detail a.mas").unbind().click(function () {
            that.log(3, fid);
        });
        $("#detail").css(pos);
        $("#detail").css({
            opacity: 1
        });
    }
    this.hideDetail = function () {
        $(".currentDetail").removeClass('currentDetail');
        $("#detail").css({
            opacity: 0
        }).removeClass('active');
        setTimeout(function () {
            if (!$("#detail").hasClass('active')) $("#detail").css({
                display: 'none'
            });
        }, SPEED / 2);
    }
    this.layout = function (items, box, distance, limit, keepx, type, morelabel, side) {
        if (typeof distance === "undefined") distance = true;
        if (typeof limit === "undefined") limit = 15;
        if (typeof keepx === "undefined") keep = false;
        if (typeof type === "undefined")
            for (id in items) {
                var type = items[id].type;
                break;
            }
        if (typeof morelabel === "undefined") morelabel = 'items';
        if (typeof side === "undefined") side = '';
        var getOverlapVector = function (a, b) {
            var da = [Math.abs(a.p2[0] - b.p1[0]), Math.abs(a.p1[0] - b.p2[0]), Math.abs(a.p2[1] - b.p1[1]), Math.abs(a.p1[1] - b.p2[1])];
            var s = -1,
                d = 1000000;
            var order = [0, 1, 2, 3];
            order = order.sort(function (a, b) {
                Math.random() - Math.random();
            });
            for (var i = 0; i < order.length; i++) {
                var j = order[i];
                if (da[j] < d) {
                    s = j;
                    d = da[j];
                }
            }
            var v = [0, 0];
            switch (s) {
                case 0:
                    v[0] = -d;
                    break;
                case 1:
                    v[0] = d;
                    break;
                case 2:
                    v[1] = -d;
                    break;
                case 3:
                    v[1] = d;
                    break;
            }
            return v;
        }
        var getDistanceVector = function (a, b) {
            var left = false,
                right = false,
                top = false,
                bottom = false;
            if (a.p2[0] <= b.p1[0]) left = true;
            if (a.p1[0] >= b.p2[0]) right = true;
            if (a.p2[1] <= b.p1[1]) top = true;
            if (a.p1[1] >= b.p2[1]) bottom = true;
            var tl = (top && left);
            var tr = (top && right);
            var bl = (bottom && left);
            var br = (bottom && right);
            if (tl || tr || bl || br) {
                var ap = [];
                var bp = [];
                if (tl) {
                    ap = a.p2;
                    bp = b.p1;
                } else if (tr) {
                    ap = [a.p1[0], a.p2[1]];
                    bp = [b.p2[0], b.p1[1]];
                } else if (br) {
                    ap = a.p1;
                    bp = b.p2;
                } else if (bl) {
                    ap = [a.p2[0], a.p1[1]];
                    bp = [b.p1[0], b.p2[1]];
                }
                var v = ap.sub(bp);
            } else {
                var v = [0, 0];
                if (top) v[1] = a.p2[1] - b.p1[1];
                else if (bottom) v[1] = a.p1[1] - b.p2[1];
                else if (left) v[0] = a.p2[0] - b.p1[0];
                else if (right) v[0] = a.p1[0] - b.p2[0];
                if (top && v[1] == 0) v[1] = -1;
                if (bottom && v[1] == 0) v[1] = 1;
                if (left && v[0] == 0) v[0] = -1;
                if (right && v[0] == 0) v[0] = 1;
            }
            return v;
        }
        var overlap = function (a, b) {
            if (a.p1[0] < b.p2[0] && a.p2[0] > b.p1[0] && a.p1[1] < b.p2[1] && a.p2[1] > b.p1[1]) {
                return true;
            } else return false;
        };
        var sorted = [];
        for (id in items) {
            var it = items[id];
            if (it.fullid != this.left && it.fullid != this.right) it.hidden = true;
            sorted.push(it);
        }
        sorted = sorted.sort(function (a, b) {
            return a.deg - b.deg;
        });
        var len = sorted.length
        var capped = [];
        if (this.mode > 0 && sorted.length > limit + 1) {
            capped = sorted.splice(0, sorted.length - limit);
            sorted = sorted.splice(sorted.length - limit);
        }
        for (var i = 0; i < sorted.length; i++) {
            var it = sorted[i];
            it.hidden = false;
            var id = it.id;
            if (distance) sorted[i].y = (sorted.length - i) / sorted.length - .5 / sorted.length;
        }
        if (!keepx && SORTBYTIME) {
            var sorted2 = sorted.sort(function (a, b) {
                return b.x - a.x;
            });
            for (var i = 0; i < sorted2.length; i++) {
                if (distance) sorted2[i].x = (sorted2.length - i) / sorted2.length - .5 / sorted2.length;
            }
        }
        var more = {
            hidden: true,
            fullid: type + '_more' + side,
            more: true
        };
        if (capped.length > 0) {
            more = {
                fullid: type + '_more' + side,
                hidden: false,
                more: true,
                name: capped.length + " more " + morelabel,
                x: .5,
                y: 1,
                type: type,
                deg: .5
            };
            $("#labels2").append(this.draw(more));
            $("#_" + more.fullid).addClass('more');
            sorted.push(more);
        }
        if (more.hidden) {
            more.obj = $("#" + more.fullid);
            more.obj2 = $("#_" + more.fullid);
        }
        var boxx = box.p1[0];
        var boxy = box.p1[1];
        var boxw = box.p2[0] - box.p1[0];
        var boxh = box.p2[1] - box.p1[1];
        var boxmx = 10;
        var boxmy = 10;
        var basefont = BASEFONT;
        for (var i = 0; i < sorted.length; i++) {
            var it = sorted[i];
            var fid = it.fullid;
            if (it.anchor && !EMBEDANCHORS) continue;
            if (it.hidden) continue;
            if ($("#_" + fid).length == 0) $("#labels2").append(this.draw(it));
            else {
                if ($("#" + fid + " span").length > 0) $("#" + fid + " span").html(this.getShortName(it));
                if ($("#_" + fid + " span").length > 0) $("#_" + fid + " span").html(this.getShortName(it));
            }
            it.obj2 = $("#_" + fid);
            if (typeof it.fs === "undefined") it.fs = this.fontsize;
            if (it.anchor) it.obj2.addClass('anchor');
            else it.obj2.css({
                'font-size': it.fs
            });
            var w = it.obj2.width();
            var h = it.obj2.height();
        }
        for (var i = 0; i < sorted.length; i++) {
            var it = sorted[i];
            var fid = it.fullid;
            if (it.anchor && !EMBEDANCHORS) continue;
            var x = boxx + boxmx + it.x * (boxw - 2 * boxmx);
            var y = boxy + boxmy + it.y * (boxh - 2 * boxmy);
            var w = it.obj2.width();
            var h = it.obj2.height();
            if (keepx) {
                it.p1 = [boxw / 5, y];
                it.p = [boxw / 5 + w / 2, y + h / 2];
                it.p2 = [boxw / 5 + w, y + h];
            } else if (ICONANCHORED) {
                it.p1 = [x, y - h / 2];
                it.p = [x + w / 2, y];
                it.p2 = [x + w, y + h / 2];
            } else {
                it.p1 = [x - w / 2, y - h / 2];
                it.p = [x, y];
                it.p2 = [x + w / 2, y + h / 2];
            }
        }
        var wall = (boxw + boxh) / 2;
        var margin = 2;
        var w1 = [boxx - wall, boxy - wall];
        var w2 = [boxx + boxw - margin, boxy - wall];
        var w3 = [boxx + boxw + wall, boxy + margin];
        var w4 = [boxx + boxw + wall, boxy + boxh + wall];
        var w5 = [boxx + margin, boxy + boxh + wall];
        var w6 = [boxx - wall, boxy + boxh - margin];
        var walls = [{
            p1: w1,
            p2: w5,
            wall: true,
            s: 10
        }, {
            p1: w1,
            p2: w3,
            wall: true,
            s: 10
        }, {
            p1: w2,
            p2: w4,
            wall: true,
            s: 10
        }, {
            p1: w6,
            p2: w4,
            wall: true,
            s: 10
        }, ];
        for (var k = 0; k < LAYOUTRUNS; k++) {
            for (var i = 0; i < sorted.length; i++) {
                it = sorted[i];
                if (it.wall) continue;
                else if (!EMBEDANCHORS && it.anchor) continue;
                for (var j = 0; j < sorted.length; j++) {
                    if (i != j) {
                        it2 = sorted[j];
                        var lap = overlap(it, it2);
                        if (lap) var v = getOverlapVector(it, it2);
                        else if (distance) v = getDistanceVector(it, it2);
                        else v = [0, 0];
                        var d = v.abs();
                        if (lap || d < 50) {
                            if (lap) {
                                if (distance) v = v.mul(1.5);
                            } else if (distance) {
                                d = v.abs();
                                v = v.unit().mul(.75 / d);
                            }
                            it.p = it.p.plus(v);
                            it.p1 = it.p1.plus(v);
                            it.p2 = it.p2.plus(v);
                        }
                    } else if (i != j) console.log(it.fullid, this.left);
                }
                v = [0, 0];
                if (it.p1[0] < box.p1[0] + margin) v[0] = box.p1[0] + margin - it.p1[0];
                else if (it.p2[0] > box.p2[0] - margin) v[0] = box.p2[0] - margin - it.p2[0];
                if (it.p1[1] < box.p1[1] + margin) v[1] = box.p1[1] + margin - it.p1[1];
                else if (it.p2[1] > box.p2[1] - margin) v[1] = box.p2[1] - margin - it.p2[1];
                if (v[0] != 0 || v[1] != 0) {
                    it.p = it.p.plus(v);
                    it.p1 = it.p1.plus(v);
                    it.p2 = it.p2.plus(v);
                }
            }
        }
        return more;
    }
    this.showHelp = function () {
        var that = this;
        this.log(5);
        this.hideDropdown("feedback");
        this.hideDropdown("share");
        $("#help").addClass('active');
        $("#helpoverlay").css({
            opacity: 1,
            display: 'inline-block'
        });
        $("#help,#helpoverlay").unbind().click(function () {
            that.hideHelp();
        });
    };
    this.hideHelp = function () {
        var that = this;
        $("#help").removeClass('active');
        $("#helpoverlay").css({
            opacity: 0,
            display: 'none'
        });
        $("#help").unbind().click(function () {
            that.showHelp();
        });
    };
    this.hideDropdown = function (which) {
        var that = this;
        $("#" + which).removeClass('active');
        $("#" + which + "overlay").css({
            opacity: 0,
            display: 'none'
        });
        $("#" + which).unbind().click(function () {
            that.showDropdown(which);
        });
    }
    this.showDropdown = function (which) {
        var that = this;
        this.hideDropdown("feedback");
        this.hideDropdown("share");
        this.hideHelp();
        var pos = $("#" + which).addClass('active').position()
        var w = $("#" + which).outerWidth();
        var h = $("#" + which).outerHeight();
        var w_ = $("#" + which + "overlay").outerWidth();
        $("#" + which + "overlay").css({
            opacity: 1,
            display: 'inline-block',
            top: pos.top + h,
            left: pos.left - w_ + w + 2
        });
        $("#" + which + ",#" + which + "").unbind().click(function () {
            that.hideDropdown(which);
        });
        if (which == "feedback") {
            var subject = "Feedback about PivotPaths (" + this.sessionID + ")";
            var body = "\n";
            body += "How would you describe your experience using PivotPaths?\n\n\n";
            body += "Did you make any discoveries or observations that you would like to share?\n\n\n";
            body += "What kind of questions have you tried to answer (successfully or not)?\n\n\n";
            body += "Do you want to add any other ideas or thoughts about PivotPaths?\n\n\n";
            body += "-----------------------------------------------------------------------------\n";
            body += "Link to your current view: " + window.location.href;
        } else {
            var subject = document.title;
            var body = "Hey, look at what I found on PivotPaths:\n";
            body += window.location.href;
        }
        if (which == "feedback") var mailto = "mailto:" + EMAIL;
        else var mailto = "mailto:";
        mailto += "?subject=" + encodeURIComponent(subject);
        mailto += "&body=" + encodeURIComponent(body);
        $("#" + which + "overlay a").attr({
            href: mailto
        });
        $("#shareoverlay a").unbind().click(function () {
            $(window).unbind();
            setTimeout(function () {
                that.events();
            }, 25);
            that.log(6);
        });
        $("#feedbackoverlay a").unbind().click(function () {
            that.feedbacked = true;
            that.log(7);
        });
    }
    this.results = function (animate) {
        if (typeof animate === "undefined") animate = true;
        var that = this;
        this.runs++;
        if (this.runs > 1) this.hideEdges(true);
        $("#cap").css({
            opacity: 1
        });
        $("#cap div").css({
            opacity: 0
        });
        $("#loading").css({
            opacity: 0,
            display: 'none'
        });
        var limit = this.limit;
        var items = [];
        for (id in this.items) items.push(this.items[id]);
        items = items.sort(function (a, b) {
            return a.order - b.order;
        });
        if (this.mode === 1) {
            var n = 0;
            for (var i = 0; i < items.length; i += 1) {
                var it = items[i];
                it.trans = "rotate(45deg)";
                it.hidden = false;
                n++;
            }
        } else if (this.mode === 2) {
            var l = 0,
                r = 0;
            var itemsL = [],
                itemsR = [];
            var item_id = this.left.split("_")[1];
            for (var i = 0; i < items.length; i += 1) {
                var it = items[i];
                if (it.anchor) it.hidden = false;
                else {
                    it.trans = "rotate(45deg)";
                    if (typeof it.cites_[item_id] !== "undefined") {
                        if (l < limit) {
                            l++;
                            it.hidden = false;
                            itemsL.push(it);
                        } else it.hidden = true;
                    } else if (typeof it.refs_[item_id] !== "undefined") {
                        if (r < limit) {
                            r++;
                            it.hidden = false;
                            itemsR.push(it);
                        } else it.hidden = true;
                    } else console.log('neither left nor right', it);
                }
            }
        } else {
            var l = 0,
                m = 0,
                r = 0;
            var itemsL = [],
                itemsM = [],
                itemsR = [];
            for (var i = 0; i < items.length; i += 1) {
                var it = items[i];
                if (it.anchor) it.hidden = false;
                else {
                    it.trans = "rotate(45deg)";
                    if (it.sim == 0) {
                        if (l < limit) {
                            l++;
                            it.hidden = false;
                            itemsL.push(it);
                        } else it.hidden = true;
                    } else if (it.sim == 1) {
                        if (r < limit) {
                            r++;
                            it.hidden = false;
                            itemsR.push(it);
                        } else it.hidden = true;
                    } else {
                        if (m < limit) {
                            m++;
                            it.hidden = false;
                            itemsM.push(it);
                        } else it.hidden = true;
                    }
                }
            }
        }
        var authors = [];
        var tags = [];
        var authorCntMax = 0;
        var authorCntMin = 10;
        var authorCntAvg = 0;
        var tagCntMax = 0;
        var tagCntMin = 10;
        var tagCntAvg = 0;
        var totalAuthors = 0;
        var totalTags = 0;
        for (id in this.authors) {
            var it = this.authors[id];
            if (it.anchor) {
                it.hidden = false;
                continue;
            }
            if (it.id == 1) it.hidden = true;
            else {
                totalAuthors++;
                var cnt = 0;
                for (item_id in it.items)
                    if (!this.items[item_id].hidden) cnt++;
                it.cnt = cnt;
                authorCntMax = Math.max(it.cnt, authorCntMax);
                authorCntMin = Math.min(it.cnt, authorCntMin);
                authorCntAvg += it.cnt;
                it.hidden = false;
                authors.push(it);
            }
        }
        authorCntAvg /= authors.length;
        for (id in this.tags) {
            var it = this.tags[id]
            if (it.anchor) {
                it.hidden = false;
                continue;
            }
            totalTags++;
            var cnt = 0;
            for (item_id in it.items)
                if (!this.items[item_id].hidden) cnt++;
            it.cnt = cnt;
            tagCntMax = Math.max(it.cnt, tagCntMax);
            tagCntMin = Math.min(it.cnt, tagCntMin);
            if (it.cnt > 0) tags.push(it);
            it.hidden = true;
        }
        tags = tags.sort(function (a, b) {
            if (a.cnt == b.cnt) return b.count - a.count;
            else return b.cnt - a.cnt;
        });
        var n = 0;
        for (var i = 0; i < tags.length; i += 1) {
            if (n < this.limit * 1.5) {
                if (tags[i].id != 1) {
                    n++;
                    tags[i].hidden = false;
                    tagCntAvg += it.cnt;
                }
            } else break;
        }
        tags = tags.slice(0, i);
        tagCntAvg /= tags.length;
        $('.anchor').removeClass('anchor');
        $('.search').remove();
        var l = $("#" + this.left);
        var l2 = $("#_" + this.left);
        var r = $("#" + this.right);
        var r2 = $("#_" + this.right);
        var it = this.all[this.left];
        this.updateLabel(it);
        it.fs = this.fontsize * 1.15;
        if (typeof it.obj2 === "undefined" || l2.length == 0) {
            $("#labels2").append(that.draw(it));
            it.obj2 = $("#_" + it.fullid);
            l2 = it.obj2;
        }
        it.obj2.css({
            "font-size": it.fs
        });
        if (this.mode == 3) {
            var it = this.all[this.right];
            this.updateLabel(it);
            it.fs = this.fontsize * 1.15;
            if (r2.length == 0 || typeof it.obj2 === "undefined") {
                var it = this.all[this.right];
                $("#labels2").append(that.draw(it));
                it.obj2 = $("#_" + it.fullid);
                r2 = it.obj2;
            }
            it.obj2.css({
                "font-size": it.fs
            });
        }
        l.addClass('anchor');
        l2.addClass('anchor');
        r.addClass('anchor');
        r2.addClass('anchor');
        var w = l2.width();
        var w_ = r2.width();
        var W = this.width;
        var h = l2.height();
        if (this.mode === 1) {
            var x = this.fontsize;
        } else if (this.mode === 2) {
            var iw = (W - w - 20 * this.fontsize) / (itemsL.length + itemsR.length);
            var x = 10 * this.fontsize + iw * itemsL.length;
            if (isNaN(x)) x = this.width / 2 - w / 2;
        } else {
            var iw = (W - w - w_ - 22 * this.fontsize) / (itemsL.length + itemsM.length + itemsR.length);
            var x = 5 * this.fontsize + iw * itemsL.length;
            if (isNaN(x)) x = 6 * this.fontsize;
            var x_ = x + w + 6 * this.fontsize + iw * itemsM.length;
            if (isNaN(x_)) x_ = W - 6 * this.fontsize;
        }
        var y = this.height / 2;
        var it = this.all[this.left];
        var anchor_correct = ACORRECT0 * this.fontsize;
        if (this.mode == 2) anchor_correct = ACORRECT1 * this.fontsize;
        else if (this.mode == 3) anchor_correct = ACORRECT2 * this.fontsize;
        it.p = [x - anchor_correct + w / 2, y];
        it.p1 = [x - anchor_correct, y - h / 2];
        it.p2 = [x - anchor_correct + w, y + h / 2];
        if (this.mode === 3) {
            var it = this.all[this.right];
            it.p = [x_ - anchor_correct + w_ / 2, y];
            it.p1 = [x_ - anchor_correct, y - h / 2];
            it.p2 = [x_ - anchor_correct + w_, y + h / 2];
        }
        var stagger = 0;
        if (that.mode > 1) stagger = this.fontsize * 2;
        var ml = $("#meta_left").position();
        if (Math.abs(x - ml.left) > stagger + 1) $("#meta_left,#order_left").css({
            opacity: 0
        });
        var mr = $("#meta_right").position();
        $("#meta_right,#order_right").css({
            opacity: 0
        });
        $("#meta_left,#meta_right").css({
            "z-index": 0
        });
        $("#order_left,#order_right").val(this.order);
        $("#meta, #order select, #cap").css({
            'font-size': this.fontsize
        });
        setTimeout(function () {
            var type = Number(that.left.charAt(0));
            switch (type) {
                case 0:
                    $("#meta_left").html(PUBSBY);
                    break;
                case 1:
                    $("#meta_left").html(PUBSRE);
                    break;
                case 2:
                    $("#meta_left").html(PABOUT);
                    break;
                default:
                    break;
            }
            var stagger = 0;
            if (that.mode > 1) stagger = that.fontsize * 2;
            $("#meta_left").css({
                left: x - stagger - anchor_correct,
                top: y - 3 * that.fontsize,
                opacity: 1,
                "z-index": 4
            });
            $("#order_left").css({
                left: x - stagger * 2 - anchor_correct,
                top: y - 5 * that.fontsize,
                opacity: 1
            });
            if (that.mode === 3) {
                var type = Number(that.right.charAt(0));
                switch (type) {
                    case 0:
                        $("#meta_right").html(PUBSBY);
                        break;
                    case 1:
                        $("#meta_right").html(PUBSRE);
                        break;
                    case 2:
                        $("#meta_right").html(PABOUT);
                        break;
                    default:
                        break;
                }
                $("#meta_right").css({
                    left: x_ - stagger - anchor_correct,
                    top: y - 3 * that.fontsize,
                    opacity: 1,
                    "z-index": 4
                });
                $("#order_right").css({
                    left: x_ - stagger * 2 - anchor_correct,
                    top: y - 5 * that.fontsize,
                    opacity: 1
                });
            }
        }, SPEED);
        var layoutItems = function (itemsX, x_min, x_max) {
            var off = (x_max - x_min) / itemsX.length / 2 - that.fontsize;
            for (var i = 0; i < itemsX.length; i += 1) {
                var it = itemsX[i];
                it.fs = that.fontsize + 1;
                if ($("#_" + it.fullid)) $("#labels2").append(that.draw(it));
                it.obj2 = $("#_" + it.fullid).css({
                    "font-size": it.fs
                });
                var w = it.obj2.width();
                var h = it.obj2.height();
                var x = off + that.interval(i, 0, itemsX.length, x_min, x_max);
                var y = that.height / 2 - ITEMSUP * that.fontsize;
                var dis = 60;
                var disx = ITEMSRIGHT * that.fontsize;
                it.p1 = [x + disx, y - dis - h / 2];
                it.p = [x + disx + w / 2, y - dis];
                it.p2 = [x + disx + w, y - dis + h / 2];
            }
        }
        var capText = function (here, there) {
            if (here == there) {
                if (here == 1) return here + " item";
                else return here + " items";
            } else return here + " of " + there + " items";
        }
        var cap_lefts = [0, 0, 0];
        var cap_texts = ["", "", ""];
        if (this.mode == 1) {
            layoutItems(items, x + w, W - 12 * that.fontsize);
            if (items.length > 0) {
                cap_lefts[0] = items[0].p1[0];
                cap_texts[0] = capText(items.length, that.total[0]);
            }
        } else if (this.mode == 2) {
            layoutItems(itemsL, 0, x - 12 * that.fontsize);
            layoutItems(itemsR, x + w, W - 12 * that.fontsize);
            if (itemsL.length > 0) {
                cap_lefts[0] = itemsL[0].p1[0];
                cap_texts[0] = capText(itemsL.length, that.total[0]);
            }
            if (itemsR.length > 0) {
                cap_lefts[2] = itemsR[0].p1[0];
                cap_texts[2] = capText(itemsR.length, that.total[1]);
            }
        } else {
            layoutItems(itemsL, 0, x - 6 * that.fontsize);
            layoutItems(itemsM, x + w, x_ - 6 * that.fontsize);
            layoutItems(itemsR, x_ + w_, W - 12 * that.fontsize);
            if (itemsL.length > 0) {
                cap_lefts[0] = itemsL[0].p1[0];
                cap_texts[0] = capText(itemsL.length, that.total[0]);
            }
            if (itemsM.length > 0) {
                cap_lefts[1] = itemsM[0].p1[0];
                cap_texts[1] = capText(itemsM.length, that.total[1]);
            }
            if (itemsR.length > 0) {
                cap_lefts[2] = itemsR[0].p1[0];
                cap_texts[2] = capText(itemsR.length, that.total[2]);
            }
        }
        setTimeout(function () {
            $("#cap_left").html(cap_texts[0]).css({
                left: cap_lefts[0] + 5,
                top: that.height / 2 + 6 * that.fontsize,
                opacity: 1
            });
            $("#cap_middle").html(cap_texts[1]).css({
                left: cap_lefts[1] + 5,
                top: that.height / 2 + 6 * that.fontsize,
                opacity: 1
            });
            $("#cap_right").html(cap_texts[2]).css({
                left: cap_lefts[2] + 5,
                top: that.height / 2 + 6 * that.fontsize,
                opacity: 1
            });
        }, SPEED);
        var layoutMeta = function (itemsX) {
            for (var i = 0; i < itemsX.length; i += 1) {
                var it = itemsX[i];
                it.fs = that.fontsize;
                if (ADJUSTFONT) {
                    var minfont = that.fontsize / FONTFACTOR;
                    var maxfont = that.fontsize * FONTFACTOR;
                    if (it.type == 0) {
                        var mincnt = authorCntMin;
                        var maxcnt = authorCntMax;
                    } else {
                        var mincnt = tagCntMin;
                        var maxcnt = tagCntMax;
                    }
                    if (mincnt == maxcnt) it.fs = that.fontsize - 1;
                    else it.fs = that.interval(it.cnt, mincnt, maxcnt, minfont, maxfont, true);
                }
                if ($("#_" + it.fullid)) $("#labels2").append(that.draw(it));
                it.obj2 = $("#_" + it.fullid).css({
                    "font-size": it.fs
                });
                var w = it.obj2.width();
                var h = it.obj2.height();
                var x = 0;
                for (item_id in it.items) {
                    var it2 = that.items[item_id]
                    if (typeof it2.p1 !== "undefined" && !it2.hidden) {
                        var w_ = it2.p2[0] - it2.p1[0];
                        if (it2.anchor) x += it2.p1[0] + w_ / 2;
                        else {
                            var d = Math.sqrt(w_ * w_ / 2);
                            x += it2.p1[0] + d / 2;
                        }
                    }
                }
                x /= it.cnt;
                if (it.type == 0) var y = that.topmargin + that.height / 4 * i / itemsX.length;
                else var y = that.height - that.margin - that.height / 4 * i / itemsX.length;
                it.p1 = [x - w / 2, y - h / 2];
                it.p = [x, y];
                it.p2 = [x + w / 2, y + h / 2];
            }
            var getOverlapVector = function (a, b) {
                var da = [Math.abs(a.p2[0] - b.p1[0]), Math.abs(a.p1[0] - b.p2[0]), Math.abs(a.p2[1] - b.p1[1]), Math.abs(a.p1[1] - b.p2[1])];
                var s = -1,
                    d = 1000000;
                var order = [0, 1, 2, 3];
                order = order.sort(function (a, b) {
                    Math.random() - Math.random();
                });
                for (var i = 0; i < order.length; i++) {
                    var j = order[i];
                    if (da[j] < d) {
                        s = j;
                        d = da[j];
                    }
                }
                var v = [0, 0];
                switch (s) {
                    case 0:
                        v[0] = -d;
                        break;
                    case 1:
                        v[0] = d;
                        break;
                    case 2:
                        v[1] = -d;
                        break;
                    case 3:
                        v[1] = d;
                        break;
                }
                return v;
            }
            var overlap = function (a, b) {
                if (a.p1[0] < b.p2[0] && a.p2[0] > b.p1[0] && a.p1[1] < b.p2[1] && a.p2[1] > b.p1[1]) {
                    return true;
                } else return false;
            };
            var runs = 0;
            var laps = 1;
            while (runs < 50 && laps > 0) {
                laps = 0;
                runs++;
                for (var i = itemsX.length - 1; i > -1; i--) {
                    for (var j = itemsX.length - 1; j > -1; j--) {
                        if (i != j && overlap(itemsX[i], itemsX[j])) {
                            laps++;
                            var a = itemsX[i];
                            var b = itemsX[j];
                            var v = getOverlapVector(a, b);
                            a.p = a.p.plus(v);
                            a.p1 = a.p1.plus(v);
                            a.p2 = a.p2.plus(v);
                        }
                    }
                }
            }
        }
        authors = authors.sort(function (a, b) {
            if (a.cnt == b.cnt) return b.count - a.count;
            else return b.cnt - a.cnt;
        });
        tags = tags.sort(function (a, b) {
            if (a.cnt == b.cnt) return b.cites - a.cites;
            else return b.cnt - a.cnt;
        });
        layoutMeta(authors);
        layoutMeta(tags);
        this.display(this.all, animate);
        this.events();
        if (this.runs > 1) setTimeout(function () {
            that.drawEdges(true)
        }, SPEED * 1.5);
        else that.drawEdges(true);
    }
    this.search = function (animate, pos, val, right) {
        this.runs++;
        var that = this;
        if (this.mode != 0) {
            $("#search").css({
                top: 0
            });
            this.removeElement($("#search"), animate);
            return;
        } else {
            $("#meta div, #order select, #cap, #cap div").css({
                opacity: 0
            });
            $("#search").css({
                opacity: 1
            });
        }
        this.hideEdges(true);
        if (typeof right === "undefined") right = false;
        if ($("#search").length == 0) {
            var html = '<input type="text" name="search" id="search" placeholder="' + FINDHINT + '" size="40" class="cursor">';
            $('body').append(html);
            if (right) $("#search").addClass('right');
        }
        $("#search").focus();
        var h = $("#search").height();
        var w = this.fontsize * 25;
        if (typeof pos === "undefined") {
            var pos = {
                left: this.width / 2 - w / 2,
                top: this.height / 4 - h / 2,
                width: w
            }
        }
        var css = {
            left: pos.left,
            top: pos.top,
            width: pos.width,
            opacity: 1,
            'font-size': this.fontsize * 1.2
        };
        $("#search").css(css)
        if (typeof val !== "undefined") $('#search').val(val);
        var last = null;
        var timeout = null;
        $("#search").unbind();
        $("#search").keyup(function (e) {
            if (e.which == 13) that.searchQuery();
            else {
                clearTimeout(timeout);
                var delay = SPEED / 2;
                timeout = setTimeout(function () {
                    that.searchQuery();
                }, delay);
            }
        });
        $("#search").click(function () {
            if ($("#search").val() == "") that.sync();
        });
    }
    this.searchChoice = function (id) {
        return;
        var isRight = $("#search").hasClass('right');
        if ($("#search").val() == "") {
            if (this.mode == 0) {
                this.sync();
            } else if (this.mode == 1) {
                this.sync();
                this.pivot();
            } else if (isRight) {
                this.pivot();
            } else {
                if (this.rightSearch != "") this.leftSearch = this.rightSearch;
                this.pivot(this.right);
            }
        } else {
            var id = $('.cursor').attr('id');
            var type = id.split("_")[0];
            $("#search").blur();
            if (this.mode == 0) {
                this.mode = 1;
                if (type < 0) {
                    this.leftSearch = value;
                    var l = $("#-1_");
                    if (l.length == 0) {
                        console.log('not search item');
                    } else {
                        l.addClass('anchor');
                    }
                    this.pivot(-1);
                } else {
                    $("#" + id).addClass('anchor');
                    this.pivot(id);
                }
            } else if (this.mode == 1) {} else if (this.mode == 2) {}
            if (type > -1) {
                if (isRight) $("#-2_").remove();
                else $("#-1_").remove();
            } else {
                $("#" + type + "_ span").html(value).addClass('anchor');
            }
            $('.cursor').removeClass('cursor');
        }
    }
    this.searchQuery = function () {
        this.hideDetail();
        var pos = $("#search").position();
        if ($("#search").val() == this.searchTerm) return;
        else this.searchTerm = $("#search").val();
        var searchNoSpaces = this.searchTerm.replace(/\s/g, '');
        if (searchNoSpaces == "" && this.mode == 0) {
            this.sync();
        } else {
            $("#loading2").css({
                top: pos.top + 3,
                left: pos.left + $("#search").width(),
                opacity: 1,
                display: 'block'
            });
            //var script = BASEURL + "hint.php?s=" + PUBTYPE + "&q=";
            var script = "http://mariandoerk.de/pivotpaths/demo/" + "hint.php?s=" + PUBTYPE + "&q=";
            jQuery.getJSON(script + this.searchTerm, function (hints, status, xhr) {
                if (view.mode == 0) view.searchMap(hints);
                $("#loading2").css({
                    opacity: 0,
                    display: 'none'
                });
            });
        }
    }
    this.searchMap = function (hints) {
        var isRight = $("#search").hasClass('right');
        var results = hints.pop();
        var max = 12
        var types = 3;
        var allocs = [];
        var extras = [];
        var total = 0;
        var actual = 0;
        var surplus = 0;
        for (var i = 0; i < hints.length; i++) {
            allocs[i] = Math.min(hints[i].length, Math.round(max / types));
            extras[i] = hints[i].length - allocs[i];
            actual += hints[i].length;
            total += allocs[i];
            surplus += extras[i];
        }
        while (total < max && surplus > 0) {
            for (var i = 0; i < hints.length; i++) {
                if (extras[i] > 0 && total < max) {
                    allocs[i]++;
                    extras[i]--;
                    total++;
                    surplus--;
                }
            }
        }
        var combined = [];
        for (var i = 0; i < hints.length; i++) {
            combined = combined.concat(hints[i].slice(0, allocs[i]));
        }
        hints = combined;
        var authors = {};
        var items = {};
        var tags = {};
        var obj = {};
        for (var i = 0; i < hints.length; i++) {
            var it = hints[i];
            it.fs = this.fontsize * 1.15;
            it.x = 0;
            it.y = .1 + .9 * i / (max);
            obj[it.fullid] = it;
            switch (it.type) {
                case 0:
                    authors[it.id] = it;
                    break;
                case 1:
                    items[it.id] = it;
                    break;
                case 2:
                    tags[it.id] = it;
                    break;
            }
        }
        this.searchLength = hints.length;
        this.searchCursor = 0;
        this.hints = obj;
        this.sync([authors, items, tags]);
        this.searchDisplay();
    }
    this.searchDisplay = function (animate) {
        if (typeof animate === "undefined") animate = true;
        var pos = $("#search").position();
        var h = this.fontsize * 12 * 2.5;
        var box = {
            p1: [pos.left, pos.top],
            p2: [pos.left + 1000, pos.top + h + $("#search").height()]
        }
        this.layout(this.hints, box, false, false, false, false);
        this.display(this.hints, animate);
        this.events();
    }
    this.getColor = function (type) {
        switch (type) {
            case 0:
                return "#3488BC";
                break;
            case 1:
                return "#62A55E";
                break;
            case 2:
                return "#CD5968";
                break;
            default:
                return "#777";
                break;
        }
    }
    this.getShortName = function (it) {
        if (typeof it === "undefined") return '';
        if (this.mode == 0) {
            if (it.type == 0) name = it.fullname.shorten(100);
            else var name = it.name.shorten(100);
        } else if (it.fullid == this.left || it.fullid == this.right) var name = it.name.shorten(25);
        else {
            if (it.name === null || typeof it.name.shorten === "undefined") var name = "";
            else var name = it.name.shorten(30);
        }
        return "" + name;
    }
    this.interval = function (x, xmin, xmax, ymin, ymax, bound) {
        if (typeof bound === "undefined") bound = false;
        if (xmin == xmax) {
            return ymax;
        }
        var m = (ymax - ymin) / (xmax - xmin);
        var n = -xmin * m + ymin;
        var y = x * m + n;
        if (bound) {
            y = Math.min(ymax, y);
            y = Math.max(ymin, y);
        }
        return y;
    };
    this.isAnchor = function (it) {
        if (it.fullid === this.left) return 0;
        else if (it.fullid === this.right) return 1;
        else return -1;
    };
    this.getSide = function (it) {
        if (this.mode === 1) return 0;
        else if (it.sim === 0) return -1;
        else if (it.sim === 1) return 1;
        else return 0;
    }
    return this;
}
String.prototype.shorten = function (len) {
    if (this.length > len) return this.substr(0, len) + "…";
    else return this;
};
Array.prototype.abs = function () {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
};
Array.prototype.mul = function (a) {
    return [this[0] * a, this[1] * a];
};
Array.prototype.div = function (a) {
    return [this[0] / a, this[1] / a];
};
Array.prototype.plus = function (v) {
    return [this[0] + v[0], this[1] + v[1]];
};
Array.prototype.sub = function (v) {
    return [this[0] - v[0], this[1] - v[1]];
};
Array.prototype.unit = function () {
    return [this[0] / this.abs(), this[1] / this.abs()];
};
Array.prototype.flip = function () {
    return [-this[1], this[0]];
};
Array.prototype.str = function () {
    return " " + this[0] + " " + this[1] + " ";
};
Array.prototype.dot = function (v) {
    return this[0] * v[0] + this[1] * v[1];
};
Array.prototype.dist = function (v) {
    return Math.sqrt((this[0] - v[0]) * (this[0] - v[0]) + (this[1] - v[1]) * (this[1] - v[1]));
};
Array.prototype.avg = function (v) {
    return [(this[0] + v[0]) / 2, (this[1] + v[1]) / 2];
};
Array.prototype.angle = function (v) {
    var dot = this.dot(v);
    var rad = Math.acos(this.dot(v) / (this.abs() * v.abs()));
    var deg = rad * 180 / Math.PI;
    return deg;
};
