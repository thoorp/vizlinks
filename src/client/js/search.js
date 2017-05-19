var searchComponent = Vue.component("search", {
   template : '<span class="typeahead-button"><button type="button" v-on:click="searchSVG"><i class="typeahead-search-icon"></i></button></span>',
   props: ["toggleSearch", "params", "getSVG"],
   methods : {
       searchSVG: function () {
           this.toggleSearch();
           this.params.view = 'highlevel';
           this.getSVG();
       }
   }
});