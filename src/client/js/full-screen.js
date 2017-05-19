var fullScreenComponent = Vue.component("fullScreen", {
   template: '<button class="btn btn-default" v-on:click="fullScreen"><span class="glyphicon glyphicon-resize-full"></span></button>'+
             '<button class="btn btn-default" v-on:click="exitFullScreen"><span class="glyphicon glyphicon-resize-small"></span>', 
    methods:  {
        fullScreen : function() {
            if (screenfull.enabled) {
                screenfull.request();
            }
        },
        exitFullScreen : function() {
            if (screenfull.enabled) {
                screenfull.exit();
            }            
        }
    }
});