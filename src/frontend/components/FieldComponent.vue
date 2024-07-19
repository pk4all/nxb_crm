<template>
  <div class="mb-3">
      <hr style="border: 1px dashed #5a5858;" class="mt-0 mb-1">
  </div>
  <span class="badge bg-primary align-self-center rounded-pill ms-auto">{{index+1}}</span>
  <div class="row">
    <div class="col-sm-5">
      <div class="mb-3">
        <label class="form-label">Field Title:<span class="text-danger">*</span></label>
        <textarea v-model="fieldsData.title" @input="updateValue" type="text" name="title" class="form-control" placeholder="Field title" required> </textarea>
      </div>
    </div>
    <div class="col-sm-4">
      <FieldTypesComponent v-model="fieldsData.type" @update:modelValue="updateFieldSet(index, $event)" />
    </div>
    <div class="col-sm-2">
      <label class="form-label full-width">Required:</label>
      <input v-model="fieldsData.required" @change="updateValue" type="checkbox" name="required" >
    </div>
    <div class="col-sm-1">
      <div class="mb-0 mt-4">
          <button @click="$emit('remove')" type="button" class="btn btn-danger btn-icon rounded-pill">
              <i class="ph-minus"></i>
          </button>
      </div>
    </div>
  </div>
  <div v-if="optState" class="options">
    <div v-for="(opt, index) in options" :key="index">
        <OptionComponent :modelValue="opt" :index="index" @remove="removeOption(index)" @update:modelValue="updateOptionSet(index, $event)"/>
    </div>
      <div class="mb-3">
          <button @click="addOption" type="button" class="btn btn-warning btn-icon rounded-pill mt-2 p-1">
              <i class="ph-plus"></i>
          </button>
      </div>  
  </div>
  <div class="mb-3" v-if="ratingState">
     <RatingComponent :modelValue="rating" :index="index" @update:modelValue="updateRatingSet(index, $event)"/>
  </div>

</template>
  <script>
  import { ref, watch ,onMounted} from 'vue';
  import FieldTypesComponent from './FieldTypesComponent.vue'
  import OptionComponent from './OptionComponent.vue';
  import RatingComponent from './RatingComponent.vue';
  export default {
    name: 'FieldComponent',
    props: {
        modelValue: {
          type: Object,
          default: () => ({ title: '', type: 'text',required:false,options:[] })
        },
        index: Number
    },
    setup(props,{ emit }) {
      const fieldsData = ref({ ...props.modelValue });
      //console.log(fieldsData,'fieldsData');
      const updateValue = () => {
        emit('update:modelValue', fieldsData.value);
        //console.log(fieldsData.value.options,'fieldsData data');
      };
      watch(props.modelValue, (newValue) => {
        fieldsData.value = { ...newValue };
      });
      const optState = ref(false);
      const ratingState = ref(false);
      const options = ref([]);
      const rating = ref({type:'rating',value:'2',icon:'ph-star',color:'#f57900'});
      const updateFieldSet = (index, newValue) => {
        emit('update:modelValue', fieldsData.value);
        fieldsData.value.type = newValue;
        if(newValue == 'checkbox' || newValue == 'select'||newValue == 'radio'){
          options.value = [{type:'option',value:''}];
          fieldsData.value.options=options;
          optState.value=true;
          ratingState.value = false;
        }else if(newValue == 'rating'){
          //rating.value =[];
          fieldsData.value.options=rating;
          optState.value=false;
          ratingState.value = true;
        }else{
          options.value =[];
          fieldsData.value.options=options;
          optState.value=false;
          ratingState.value = false;
        }
      };

      const updateOptionSet = (index, newValue)=>{
        emit('update:modelValue', fieldsData.value);
        options.value[index]=newValue;
        fieldsData.value.options=options;
      };
      
      const addOption = ()=>{
        options.value.push({type:'option',value:''});
        fieldsData.value.options=options;
      };
      const removeOption = (index) => {
        options.value.splice(index, 1);
        fieldsData.value.options=options;
      };

      const updateRatingSet = (index,newValue)=>{
        rating.value=newValue;
        fieldsData.value.options=rating;
        emit('update:modelValue', fieldsData.value);
        // console.log('rating value data',newValue,index,rating);
        // console.log('rating fields Data',fieldsData,index);
      }
      return {
        fieldsData,
        updateValue,
        updateFieldSet,
        updateOptionSet,
        optState,
        ratingState,
        addOption,
        removeOption,
        options,
        updateRatingSet,
        rating
      };
    },
    components: {
      FieldTypesComponent,
      OptionComponent,
      RatingComponent
    },
  };
  </script>