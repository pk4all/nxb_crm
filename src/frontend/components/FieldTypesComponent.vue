<template>
    <div class="mb-3" v-if="loading"><i class="ph-spinner spinner ph-2x"></i></div>
    <div class="mb-3" v-else-if="error">Error: {{ error }}</div>
    <div class="mb-3" v-else >
        <label class="form-label">Type:</label>
        <select class="form-control" v-model="fieldValue" @change="updateValue">
            <option v-for="item in data" :value="item.type">{{item.name }}</option>
        </select>
	</div>
  </template>
  <script>
  import { ref, onMounted,watch } from 'vue';
  export default {
    name: 'FieldTypesComponent',
    props: ['modelValue'],
    setup(props, { emit }) {
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
      const fieldValue = ref(props.modelValue);
     // console.log('pre value for field type',fieldValue.value);
      const updateValue = () => {
        emit('update:modelValue', fieldValue.value);
        //console.log('field type Value',fieldValue.value);
      };
      watch(() => props.modelValue, (newValue) => {
        fieldValue.value = newValue;
      });
      return {
        data,
        loading,
        error,
        fieldValue,
        updateValue
      };
    }
  };
  </script>