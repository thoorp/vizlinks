var printComponent = Vue.component("print", {
   template: '<button class="btn btn-default" v-on:click="printSVG"><span class="glyphicon glyphicon-print"></span></button>', 
    methods:  {
        printSVG : function(){
            window.print();
        }    
    }
});