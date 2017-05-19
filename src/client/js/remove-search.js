var removeSearchComponent = Vue.component("removeSearch", {
   template : '<button v-on:click="removeSearchButton()" class="btn btn-default" type="button"><span class="glyphicon glyphicon-minus"></span></button>', 
   
   props : ['searchNodes', 'index', 'attachTypeahead'],
   
   methods : {
       removeSearchButton: function () {
           this.searchNodes.splice(this.index, 1);
           //Invoke attachTypeahead method (in the next tick in event loop) after rendering the new text box.
           //If you wonder what is event loop, check out https://www.youtube.com/watch?v=8aGhZQkoFbQ 
           //this.$nextTick(this.attachTypeahead);           
       }
   }
});