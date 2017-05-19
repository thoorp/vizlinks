/*jshint strict: false */
var vm = new Vue({
    el : '#myHtml',
    components : {
        'print' : printComponent,
        'fullScreen' : fullScreenComponent,
        'theme' : themeComponent, 
        'zoom' : zoomComponent,
        'detail' : detailComponent,
        'download' : downloadComponent,        
        'search' : searchComponent,
        'addSearch' : addSearchComponent,
        'removeSearch' : removeSearchComponent,
        'showcommon' : showcommonComponent,
        'pencil' : pencilComponent
    },
    data: {
        topDivHeight: document.getElementById('search').offsetHeight,
        colors: {
            theme: 'grey',
            containerDivColorVal: 'white',
            topDivColorVal: 'lightgrey',
            midDivColorVal: 'white',
            searchMenuColorVal: 'darkgrey',
            titleColorVal: 'black',
            bottomDivColorVal: 'lightgrey',
            svgColors: {
                nodeTextCol: 'black',
                lightBgCol: 'white',
                bgCol: 'lightgrey',
                darkBgCol: 'darkgrey',
                clusterPathCol: 'darkgrey',
                nodePolyCol: 'darkgrey',
                edgePathCol: 'darkgrey',
                edgePolyCol: 'darkgrey',
                nodeEllipseLightCol: '#f2f2f2',
                nodeEllipseDarkCol: 'white'
            }
        },
        greyThemeSVGColors: {
            nodeTextCol: 'black',
            lightBgCol: 'white',
            bgCol: 'lightgrey',
            darkBgCol: 'darkgrey',
            clusterPathCol: 'darkgrey',
            nodePolyCol: 'darkgrey',
            edgePathCol: 'darkgrey',
            edgePolyCol: 'darkgrey',
            nodeEllipseLightCol: 'white',
            nodeEllipseDarkCol: '#f2f2f2'
        },
        greenThemeSVGColors: {
            nodeTextCol: 'black',
            lightBgCol: 'lightgreen',
            bgCol: 'green',
            darkBgCol: 'darkgreen',
            clusterPathCol: 'black',
            nodePolyCol: 'black',
            edgePathCol: 'black',
            edgePolyCol: 'black',
            nodeEllipseLightCol: 'lightgreen',
            nodeEllipseDarkCol: 'yellowgreen'
        },        
        display: {
            search: 'block'
        },
        searchNodes: [{
            name: 'searchNode0',
            value: ''
        }],
        params: {
            view: 'highlevel',
            activeNodes: [],
            level: 0,
            maxLevels: 0, 
            showCommonOnly: null,
            acceptHeader : "application/svg+xml"
        },
        toggle: "glyphicon glyphicon-chevron-left",
        show: true,
        searchToggleClass: 'slideInLeft',
        mysvg: document.getElementById("my-svg").querySelector("svg"),
        //width : document.getElementById("my-svg").querySelector("svg").getAttribute("width"),
        //height : document.getElementById("my-svg").querySelector("svg").getAttribute("height"),
        panZoomTiger: null,
        highlightTimer: null,
        highlightEvent: null,
        slider : null,
        sourceData : null
    },
    computed: {
        notesHeight: function(){
            var bottomDivHeight = document.getElementById('bottomDiv').offsetHeight;
            var lineHeight = window.innerHeight - (document.getElementById('search').offsetHeight) - bottomDivHeight;
            return lineHeight+'px';
        },
        title: function () {
            return this.searchNodes[0].value;
        },
        showAdd: function () {
            return !(this.searchNodes[(this.searchNodes.length - 1)].value.trim().length === 0);
        },
        lineHeight: function () {
            return {
                'line-height': this.lineHeightVal + 'px'
            };
        },
        lineHeightVal: function () {
            var totalHeight = window.innerHeight,
                // Tricky one! experiement... SUCCESS! to fix the gap between mid and bottom divs
                toTriggerThisFunc = this.topDivHeight,
                bottomDivHeight = document.getElementById('bottomDiv').offsetHeight,
                lineHeight = totalHeight - (document.getElementById('search').offsetHeight + bottomDivHeight);
            return lineHeight;
        },
        svgWidth: function () {
            //to avoid horizantal scroll bar
            return window.innerWidth - 45 + "px";
        },
        svgHeight: function () {
            //tricky one. Add 45 to fix the gap from bottom navbar when search area is collapsed.
            return this.lineHeightVal + 45 + "px";
        },
        containerDivStyle: function () {
            return 'background-color:' + this.colors.containerDivColorVal;
        },
        topDivStyle: function () {
            return 'background-color:' + this.colors.topDivColorVal;
        },
        midDivStyle: function () {
            return 'background-color:' + this.colors.midDivColorVal;
        },
        searchToggleStyle: function () {
            return 'display:' + this.display.search + '; background-color:' + this.colors.searchMenuColorVal;
        },
        svgBackgroundFillColor: function () {
            return this.colors.midDivColorVal;
        },
        titleStyle: function () {
            return 'font-weight:bold; font-size:medium; color:' + this.colors.titleColorVal;
        },
        titleDivClass: function () {
            if (this.toggle === 'glyphicon glyphicon-chevron-right') {
                return 'col-xs-10 col-lg-10';
            } else {
                return 'col-xs-2 col-lg-6';
            }
        },
        triggerSlider : function() {
            var options = {
                    min: 1,
                    max: this.params.maxLevels,
                    tooltip:'show'
            };
            if(this.slider === null) {                
                this.slider = $('#level').slider();
                $('#level').slider().on('change', this.changeLevel);                
            }
            $('#level').slider(options);
            $('#level').slider('refresh');
            return null;
        }
    },

    // define methods under the `methods` object
    methods: {
        changeLevel : function() {
          this.params.level = $('#level').slider().data('slider').getValue();
          this.getSVG();
        },
        // search view related
        toggleSearch: function () {
            if (this.searchToggleClass === 'slideInLeft') {
                this.searchToggleClass = '';
                this.toggle = "glyphicon glyphicon-chevron-right";
                this.display.search = 'none';
            } else {
                this.searchToggleClass = 'slideInLeft';
                this.toggle = "glyphicon glyphicon-chevron-left";
                this.display.search = 'block';
            }
            this.topDivHeight = document.getElementById('search').offsetHeight;
            //this.resizeCenterSVG();
        },

        // search action related
        getSVG: function () {
            this.params.acceptHeader = "application/svg+xml";
            $.ajax({
                url: this.getEndpointForSearch(this.searchNodes[0].value),
                type: "get",
                headers: {
                    Accept: this.params.acceptHeader,
                },                
                data: this.params,
                success: function (result, textStatus, request) {
                    vm.processSVG(result.documentElement);
                    //only set maxlevels from the first call when level is set to 0
                    if(vm.params.level === 0){
                        vm.params.maxLevels = request.getResponseHeader('maxlevels');
                    }
                    vm.params.level = 0;
                },
                error: function (xhr) {
                    //Do Something to handle error
                }
            });
        },
        getEndpointForSearch: function (nodeName) {
            return "/vizdotsapi/api/nodes/" + this.encode(nodeName) + "?" + this.getActiveNodeParams();
        },
        getEndpointForHighlighting: function (nodeName) {
            return "/vizdotsapi/api/nodes/" + this.encode(nodeName);
        },
        // NOTE: work around / vue-resource cannot handle list params. See https://github.com/vuejs/vue-resource/issues/217
        getActiveNodeParams: function () {
            var i, activeNodeParams = "";
            for (i = 1; i < this.searchNodes.length; i++) {
                activeNodeParams += ("activeNodes=" + this.encode(this.searchNodes[i].value) + "&");
            }
            return activeNodeParams;
        },
        encode: function (value) {
            return encodeURIComponent(encodeURIComponent(value));
        },
        decode: function (value) {
            return decodeURIComponent(decodeURIComponent(value)).replace(/\+/g, ' ');
        },
        // post search
        processSVG: function (data) {
            this.highlightEvent = null;
            $("#my-svg").html(data);
            vm.changeLinks();
            vm.handleEdgeHighlighting();
            vm.repaintWithCurrentTheme();
            //align svg vertically at the center of div
            vm.panZoomTiger = svgPanZoom('svg');
            vm.resizeCenterSVG();
        },
        changeLinks: function () {
            [].forEach.call($("svg a"), function (v) {
                var url = v.getAttribute("xlink:href");
                if ("#" !== url) {
                    v.setAttribute("url", vm.decode(url));
                    v.addEventListener('click', vm.drillDown);
                    v.setAttribute("xlink:href", "#");
                }
            });
        },
        handleEdgeHighlighting: function () {
            [].forEach.call($("svg .cluster"), function (v) {
                vm.addEventListenerToCluster(v);
            });
            [].forEach.call($("svg .node"), function (v) {
                vm.addEventListenerToNode(v);
            });
        },
        drillDown: function (e) {
            e.stopPropagation();
            var url = e.currentTarget.getAttribute('url'); // ex:/vizdotsapi/api/nodes/customers-api
            this.resetSearchNodes(url.substring("/vizdotsapi/api/nodes/".length));
            vm.getSVG();
        },
        resetSearchNodes: function (searchString) {
            vm.$data.searchNodes = [{
                name: 'searchNode0',
                value: searchString
            }];
            this.$nextTick(this.attachTypeahead);
        },
        resizeCenterSVG: function () {
            $("#my-svg svg").attr("height", this.svgHeight);
            $("#my-svg svg").attr("width", this.svgWidth);
            $("#my-svg svg").attr("viewBox", "0 0 " + this.svgHeight + " " + this.svgWidth);
            this.panZoomTiger.resize();
            this.panZoomTiger.center();
        },
        repaintWithCurrentTheme: function () {
            if (this.colors.theme === 'green') {
                this.greenTheme();
            } else {
                this.greyTheme();
            }
            this.repaintSVG();
        },
        greyTheme: function () {
            this.colors.theme = 'grey';
            this.colors.searchMenuColorVal = 'darkgrey';
            this.colors.topDivColorVal = 'lightgrey';
            this.colors.titleColorVal = 'white';
            this.colors.midDivColorVal = 'white';
            this.colors.containerDivColorVal = 'white';
            this.colors.svgColors = this.greyThemeSVGColors;
        },
        greenTheme: function () {
            this.colors.theme = 'green';
            this.colors.searchMenuColorVal = 'darkgreen';
            this.colors.topDivColorVal = 'green';
            this.colors.titleColorVal = 'white';
            this.colors.midDivColorVal = 'lightgreen';
            this.colors.containerDivColorVal = 'lightgreen';
            this.colors.svgColors = this.greenThemeSVGColors;
        },
        repaintSVG: function () {
            this.mysvg = document.getElementById("my-svg").querySelector("svg");
            //change background
            var polys = this.mysvg.querySelectorAll('polygon');
            polys[0].setAttribute("fill", this.colors.svgColors.lightBgCol);

            //cluster colors
            [].forEach.call(this.mysvg.querySelectorAll('.cluster path'), function (v) {
                v.setAttribute("stroke", vm.$data.colors.svgColors.clusterPathCol);
                v.setAttribute("fill", vm.$data.colors.svgColors.lightBgCol);
            });
            // edge paths stroke and polygon stroke and fill
            [].forEach.call(this.mysvg.querySelectorAll('.edge path'), function (v) {
                v.setAttribute("stroke", vm.$data.colors.svgColors.edgePathCol);
            });
            [].forEach.call(this.mysvg.querySelectorAll('.edge polygon'), function (v) {
                v.setAttribute("stroke", vm.$data.colors.svgColors.edgePolyCol);
                v.setAttribute("fill", vm.$data.colors.svgColors.edgePolyCol);
            });
            // node polygon strokes
            [].forEach.call(this.mysvg.querySelectorAll('.node polygon,polyline'), function (v) {
                v.setAttribute("stroke", vm.$data.colors.svgColors.edgePolyCol);
            });
            // detailed nodes
            $('stop[offset="0"]').attr('style', 'stop-color:' + vm.$data.colors.svgColors.nodeEllipseLightCol + ';stop-opacity:1.;');
            $('stop[offset="1"]').attr('style', 'stop-color:' + vm.$data.colors.svgColors.nodeEllipseDarkCol + ';stop-opacity:1.;');
            
            /**
            // node text
            [].forEach.call(this.mysvg.querySelectorAll('.node text'), function (v) {
                v.setAttribute("fill", vm.$data.colors.svgColors.nodeTextCol);
            });*/
        },
        
        //edge highlighting
        addEventListenerToCluster: function (c) {
            var t = c.querySelectorAll('text');
            vm.addEventListeners(t[0]);
        },
        addEventListenerToNode: function (n) {
            var name = n.querySelectorAll('title')[0].textContent,
                te = n.querySelectorAll('text');
            te[0].setAttribute("nodeName", name);
            vm.addEventListeners(te[0]);
        },
        addEventListeners: function (t) {
            var timeout = null;
            t.onmouseover = function (eve) {
                vm.$data.highlightEvent = eve;
                vm.$data.highlightTimer = setTimeout(vm.highlightEdges, 500);
            };
            t.onmouseout = function (eve) {
                clearTimeout(vm.$data.highlightTimer);
                vm.resetHighlights();
            }
        },
        highlightEdges: function () {
            vm.resetHighlights();
            if (vm.$data.highlightEvent !== null) {
                vm.paintText(vm.$data.highlightEvent.currentTarget, 'red');
                vm.highlightDependents(vm.getCurrentTargetName(vm.$data.highlightEvent));
            }
        },
        resetHighlights: function (eve) {
            vm.resetEdgeHighlight();
            vm.resetTextHighlight();
        },
        getCurrentTargetName: function (eve) {
            var eveClass = eve.target.getAttribute("class"),
                t, currentTargetName = "";
            if (eveClass === "cluster" || eveClass === "node") {
                t = eve.target.querySelectorAll('text');
                currentTargetName = t[0].textContent;
            } else {
                if (eve.target.getAttribute("nodeName") === null) { // text
                    currentTargetName = eve.target.textContent;
                } else {
                    currentTargetName = eve.target.getAttribute("nodeName");
                }
            }
            return vm.removeIconFont(currentTargetName);
        },
        removeIconFont: function(name){           
            return name.replace(/ [\uE000-\uF8FF]/g, '');;
        },
        highlightDependents: function (name) {
            this.params.acceptHeader = "application/json";
            $.ajax({
                url: this.getEndpointForHighlighting(name),
                headers: {
                    Accept: this.params.acceptHeader,
                },
                type: "get",
                data: this.params,
                success: function (result) {
                    vm.paintDepenents(result);
                },
                error: function (xhr) {
                    //Do Something to handle error
                }
            });
        },
        paintDepenents: function (data) {
            var e, edgeTitle, edges = data.edges;
            for (e in edges) {
                if (edges.hasOwnProperty(e)) {
                    edgeTitle = edges[e].srcNode.name + '->' + edges[e].tgtNode.name;
                    vm.paintDependent(edgeTitle);
                }
            }
        },
        paintDependent: function (edgeTitle) {
            [].forEach.call(this.mysvg.querySelectorAll('g .edge'), function (v) {
                var edgeChildren = v.childNodes;
                if (edgeChildren[0].textContent === edgeTitle) {
                    vm.paintEdge(v.id, 'red', '0');
                }
            });
        },
        resetEdgeHighlight: function () {
            var i, allElements = document.getElementsByTagName("g");
            for (i = 0; i < allElements.length; i++) {
                if (allElements[i].getAttribute("class") === 'edge') {
                    vm.paintEdge(allElements[i].id, vm.getCurrentEdgeColor(), '1,5');
                }
            }
        },
        getCurrentEdgeColor: function () {
            if (this.colors.theme === 'green') {
                return this.greenThemeSVGColors.edgePathCol;
            } else {
                return this.greyThemeSVGColors.edgePathCol;
            }
        },
        paintEdge: function (edgeId, colorName, dasharray) {
            var x, i, e2, e = document.getElementById(edgeId).childNodes[2].childNodes;
            for (i = 0; i < e.length; i++) {
                e2 = e[i].childNodes;
                for (x = 0; x < e2.length; x++) {
                    if (e2[x].setAttribute) {
                        e2[x].setAttribute('stroke', colorName);
                        e2[x].setAttribute('stroke-dasharray', dasharray);
                    }
                }
            }
        },
        resetTextHighlight: function () {
            $(".cluster text, .node text").each(function () {
                if ($(this)[0].textContent === vm.$data.searchNodes[0].value) {
                    vm.paintText($(this)[0], '#af7817');
                } else {
                    vm.paintText($(this)[0], 'black');
                }
            });
        },
        paintText: function (textElement, colorName) {
            if (textElement) {
                textElement.setAttribute('fill', colorName);
            }
        },
        attachTypeahead : function(){
            $.ajax({
                url: "/vizdotsapi/api/nodes/types",
                headers: {
                    Accept: "application/json",
                },
                type: "get",
                success: function (result) {
                    vm.sourceData  = {};
                    result.forEach(function (v) {
                        vm.sourceData[v] = {url : ["/vizdotsapi/api/nodes/"+v+"/names"]};
                    });
                    $("[id^=node_]").each(function(){
                        $(this).typeahead({
                            order : "asc",
                            cache : true,
                            debug: true,
                            group: [true, "{{group}}"],
                            emptyTemplate: 'No result for "{{query}}"',
                            template: "{{display}} <small style='color:#999;'>{{group}}</small>",
                            //dropdownFilter: "all nodes",
                            source : vm.sourceData,
                            callback : {
                                onInit : function(node) {
                                    console.log('Typeahead Initiated on ' + node.selector);
                                }
                            }
                        });                
                    });                    
                },
                error: function (xhr) {
                    //TODO Do Something to handle error
                }
            });
        }        
    },    
    ready : function() {
        this.$nextTick(this.attachTypeahead);
    }    
});