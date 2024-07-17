<template>
    <div  class="row mb-2">
    <div class="col-sm-3">
      <label class="form-label" for="">Scale:</label>
      <select v-model="fieldValue.value" class="form-select" name="scale" @change="updateValue">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>
    <div class="col-sm-3">
      <label class="form-label" for=""> Shape: </label>
      <select v-model="fieldValue.icon" class="form-select"  name="shape" @change="updateValue">
        <option value="ph-star">Star</option>
        <option value="ph-smiley-wink">Smiley</option>
        <option value="ph-heart-straight">Heart</option>
        <option value="ph-thumbs-up">Thumb</option>
      </select>
    </div>
    <div class="col-sm-2">
      <label class="form-label full-width">Color:</label>
      <input v-model="fieldValue.color" @input="updateValue" class="color" type="color" name="color" >
    </div>
    <div class="col-sm-2">
      <label class="mt-3" :style="{color:fieldValue.color}"><i :class="fieldValue.icon + ' ph-2x'" :color="fieldValue.color" ></i></label>
    </div>
  </div>
  </template>
  <script>
import { ref, onMounted, watch } from 'vue';
  export default {
    name: 'RatingComponent',
    props: {
      modelValue:{
        type: Object,
        default: () => ({type:'rating',value:'2',icon:'ph-star',color:'#f57900'})
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