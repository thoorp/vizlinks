var addSearchComponent = Vue.component("addSearch", {
    template : '<button v-on:click="addSearchButton" class="btn btn-default" style="margin-top:10px; type="button"><span class="glyphicon glyphicon-plus"></span></button>',

    props : [ "searchNodes", "attachTypeahead" ],

    methods : {
        addSearchButton : function() {
            this.searchNodes.push({
                name : 'searchNode' + this.searchNodes.length,
                value : ''
            });
            //Invoke attachTypeahead method (in the next tick in event loop) after rendering the new text box.
            //If you wonder what is event loop, check out https://www.youtube.com/watch?v=8aGhZQkoFbQ 
            this.$nextTick(this.attachTypeahead);
        }
    }
});
