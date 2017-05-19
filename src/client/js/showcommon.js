var showcommonComponent = Vue.component("showcommon", {    
    template : '<button class="btn btn-default" v-on:click="togglecommon" title="Toggle Common/all Nodes"><span class="glyphicon glyphicon-modal-window"></span></button>',
    
    props : ['params', 'getSVG'],
    methods : {
    	togglecommon: function () {
    		if(this.params.showCommonOnly === 'true'){
    			this.params.showCommonOnly = '';
    		} else{
    			this.params.showCommonOnly = 'true';
    		}
    		  
              this.getSVG();
          }
        }       
            
});        