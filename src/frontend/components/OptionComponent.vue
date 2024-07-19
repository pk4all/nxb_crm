<template>
    <div  class="row mb-2">
    <div class="col-sm-4">
      <label class="form-label" for="">Option {{ index+1 }} Value:<span class="text-danger">*</span></label>
      <input v-model="fieldValue.value" @input="updateValue" type="text" name="title" class="form-control" placeholder="Option title" required >
    </div>
    <div class="col-sm-1">
      <div class="mb-0 mt-4">
          <button @click="$emit('remove')" type="button" class="btn btn-danger btn-icon rounded-pill p-0">
              <i class="ph-minus"></i>
          </button>
      </div>
    </div>
  </div>
  </template>
  <script>
import { ref, onMounted, watch } from 'vue';
  export default {
    name: 'OptionComponent',
    props: {
      modelValue:{
        type: Object,
        default: () => ({type:'option',value:''})
      },
      index:Number
    },
    setup(props, { emit }) {
      const data = ref(null);
      const loading = ref(true);
      const error = ref(null);
  
      onMounted(async () => {
        updateValue();
      });
      const fieldValue = ref(props.modelValue);
      
      const updateValue = () => {
        emit('update:modelValue', fieldValue.value);
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