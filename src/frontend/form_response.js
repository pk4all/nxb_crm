
import { createApp } from 'vue';
import Form from './components/FormResponse.vue';

const capitalizeMixin = {
    methods: {
      capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
    },
  };
const app = createApp(Form);
app.mixin(capitalizeMixin);
app.mount('#app');