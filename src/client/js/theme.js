var themeComponent = Vue.component("theme", {    
    template : '<button class="btn btn-default" v-on:click="changeTheme"><span class="glyphicon glyphicon-tasks"></span></button>',
    
    props: ['colors', 'greyTheme', 'greenTheme', 'repaintSVG'],

    methods : {
        changeTheme: function () {
            if (this.colors.theme === 'green') {
                this.greyTheme();
            } else {
                this.greenTheme();
            }
            this.repaintSVG();
        }       
    }        
});        