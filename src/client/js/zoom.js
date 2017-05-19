var zoomComponent = Vue.component("zoom", {
    template: '<button class="btn btn-default" v-on:click="zoomIn"><span class="glyphicon glyphicon-zoom-in"></span></button>'+
              '<button class="btn btn-default" v-on:click="zoomOut"><span class="glyphicon glyphicon-zoom-out"></span></button>', 
    props: ['panZoomTiger'],          
    methods : {
        zoomIn : function() {
            if(this.panZoomTiger != null){
                this.panZoomTiger.zoomIn();
            }
        },
        zoomOut : function() {
            if(this.panZoomTiger != null){
                this.panZoomTiger.zoomOut();
            }
        }
    }
});