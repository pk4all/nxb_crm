<template>
  <span class="badge bg-primary align-self-center rounded-pill ms-auto">{{index+1}}</span>
  <div class="row">
    <div class="col-sm-6" >
      <div class="mb-3">
        <label class="form-label">Field Title:</label>
        <input v-model="fieldsData.title" @input="updateValue" type="text" name="title" class="form-control" placeholder="Field title">
      </div>
    </div>
    <div class="col-sm-4">
      <FieldTypesComponent  />
    </div>
    <div class="col-sm-2">
      <div class="mb-0 mt-4">
          <button @click="$emit('remove')" type="button" class="btn btn-danger btn-icon rounded-pill">
              <i class="ph-minus"></i>
          </button>
      </div>
    </div>
  </div>
  
</template>
  <script>
  import { ref, watch ,onMounted} from 'vue';
  import FieldTypesComponent from './FieldTypesComponent.vue'
  export default {
    name: 'FieldComponent',
    props: {
        modelValue: Object,
        index: Number
    },
    setup(props,{ emit }) {
      const fieldsData = ref({ ...props.modelValue });
      const updateValue = () => {
          emit('update:modelValue', fieldsData.value);
      };
      watch(props.modelValue, (newValue) => {
        fieldsData.value = { ...newValue };
      });

      return {
        fieldsData,
        updateValue
      };
    },
    components: {
      FieldTypesComponent
    },
  };
  </script>