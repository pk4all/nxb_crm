<template>
    <div class="mb-3" v-if="loading"><i class="ph-spinner spinner ph-2x"></i></div>
    <div class="mb-3" v-else-if="error">Error: {{ error }}</div>
    <div class="mb-3" v-else >
        <label class="form-label">Type:</label>
        <select class="form-control" >
            <option v-for="item in data" :value="item.type">{{item.name }}</option>
        </select>
	</div>
  </template>
  <script>
  import { ref, onMounted } from 'vue';
  export default {
    name: 'FieldTypesComponent',
    setup() {
      const data = ref(null);
      const loading = ref(true);
      const error = ref(null);
  
      onMounted(async () => {
        try {
          const response = await fetch('/user/form-fields');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const json = await response.json();
          data.value = json.data;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
      });
  
      return {
        data,
        loading,
        error
      };
    }
  };
  </script>