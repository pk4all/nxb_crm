<template>
  <div class="row">
					<div class="col-xl-12">
						<div  class="card">
              <form ref="formRef" id="form" action="" method="post" enctype="multipart/form-data">
                <div class="card-header d-flex align-items-center">
                  <h5 class="mb-0">Create New Form</h5>
                  <div class="ms-auto d-flex">
                    <label class="form-check form-switch form-check-reverse">
                      <span class="">Public</span>
                      <input v-model="form.visibility" name="visibility" type="checkbox" class="form-check-input" value="private">
                    </label>
                    <span class="ms-1">Private</span>
                  </div>
									<div class="ms-auto">
										<label class="form-check form-switch form-check-reverse">
											<input name="status" type="checkbox" class="form-check-input" checked="" v-model="form.status">
											<span class="form-check-label">Form Status</span>
										</label>
									</div>

								</div>
                <div class="card-body pb-0">
                  <h6>Basic Details</h6>
                  <div class="row"> 
                    <div class="col-sm-8">
                      <div class="mb-3">
                        <label class="form-label">Title:<span class="text-danger">*</span></label>
                        <input v-model="form.title" type="text" name="title" class="form-control" placeholder="Form title" required>
										  </div>
                    </div>
                    <div class="col-sm-4">
                      <CategoriesComponent v-model="form.type" />
                    </div>
                    <div class="col-sm-6">
                      <div class="mb-3">
                        <label class="form-label">Description:</label>
                        <textarea id="description" class="form-control" name="description" v-model="form.description" placeholder="Form Description"></textarea>
										  </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="img mb-3">
                        <label class="form-label full-width" for="">Profile Image:</label>
                        <input class="form-control" name="profileImage" type="file" @change="onProfileImageChange">
                      </div>
                      <div class="img mb-3">
                        <label class="form-label full-width" for="">Cover Image:</label>
                        <input class="form-control" name="coverImage" type="file" @change="onCoverImageChange">
                      </div>
                    </div>
                    <h6>Form Fields</h6>
                    <div class="fields" v-for="(field, index) in fieldSets" :key="index">
                      <FieldComponent :modelValue="field" :index="index" @remove="removeField(index)" @update:modelValue="updateFieldSet(index, $event)" />
                    </div>
                    <div class="mb-3">
                        <hr style="border: 1px dashed #5a5858;" class="mt-0 mb-1">
                    </div>
                    <div class="mb-3">
                      <button @click="addField" type="button" class="btn btn-primary btn-icon rounded-pill">
                          <i class="ph-plus"></i>
                      </button>
                  </div>
                  </div>
								</div>
                <div class="card-footer d-flex align-items-center">
                  <button @click="saveForm" class="btn btn-primary" type="button" :disabled="saveBtn">
                    <i class="ph-floppy-disk "></i> 
                    <span>Save</span> 
                  </button>
                  <!-- <button class="btn btn-warning" type="button">
                    <i class="ph-cancel"></i> 
                    <span>Cancel</span> 
                  </button> -->

                  <div v-if="loader" class="m-auto">
                    <i class="ph-spinner spinner ph-2x"></i>
                  </div>
                  <div v-if="error" class="m-auto text-danger">
                      {{ error }}
                  </div>
                  <div v-if="success" class="m-auto text-success">
                      {{ success }}
                  </div>
								</div>
              </form>
						</div>
					</div>
				</div>
</template>
<script>
import CategoriesComponent from './CategoriesComponent.vue';
import FieldComponent from './FieldComponent.vue';
import { ref } from 'vue';
import axios from 'axios';
export default {
  data() {
    return {
        
    };
  },
  methods:{
    // async saveForm(){
      
    // }
  },
  components: {
    CategoriesComponent,
    FieldComponent
  },
  setup() {
    const fieldSets = ref([{ title: '', type: 'text',required:false,options:[] }]);
    const form=ref({status:true,title:'',description:'',profileImage:'',coverImage:'',type:'66966a030016436b114a41fa',visibility:'public',fields:fieldSets});
    
    const updateFieldSet = (index,newValue)=>{
      fieldSets.value[index]=newValue;
      form.value.fields=fieldSets;
    }
    
    const addField = ()=>{
      fieldSets.value.push({ title: '', type: 'text',required:false,options:[] });
      form.value.fields=fieldSets;
      //console.log(form,'all data');
    };
    const removeField = (index) => {
      fieldSets.value.splice(index, 1);
      form.value.fieldSets=fieldSets;
    };
    const loader = ref(false);
    const saveBtn = ref(false);
    const profileImageFile = ref(null);
    const profileImageUrl = ref('');
    const coverImageFile = ref(null);
    const coverImageUrl = ref('');
    const error = ref('');
    const success = ref('');

    const onProfileImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        profileImageFile.value = file;
        profileImageUrl.value = URL.createObjectURL(file);
      }
    };
    const onCoverImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        coverImageFile.value = file;
        coverImageUrl.value = URL.createObjectURL(file);
      }
    };
    const formRef = ref(null);
    const saveForm = async()=>{
      success.value='';
      error.value='';
      loader.value=true;
      saveBtn.value=true;
      if (!formRef.value.checkValidity()) {
        error.value = 'Please fill all required field value(s).';
        loader.value=false;
        saveBtn.value=false;
        success.value='';
        return false;
      }else{
        error.value='';
      }
      

      if (coverImageFile.value) {
        error.value='';
        const formData = new FormData();
        formData.append('image', coverImageFile.value);
        try {
          const response = await axios.post('/form/save-file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          form.value.coverImage=response.data.file;
          console.log('cover Image uploaded successfully:', response.data);
        } catch (error) {
          error.value=error.response ? error.response.data.message : 'An error occurred';
          console.log(error.response ? error.response.data.message : 'An error occurred');
          loader.value=false;
          saveBtn.value=false;
          return false;
        }
      }
      if (profileImageFile.value) {
        error.value='';
        const formData = new FormData();
        formData.append('image', profileImageFile.value);
        try {
          const response = await axios.post('/form/save-file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          form.value.profileImage=response.data.file;
          console.log('profile Image uploaded successfully:', response.data);
        } catch (error) {
          error.value=error.response ? error.response.data.message : 'An error occurred';
          console.log(error.response ? error.response.data.message : 'An error occurred');
          loader.value=false;
          saveBtn.value=false;
          return false;
        }
      }

      if(error.value==''){
        try {
          const response = await axios.post('/form/save-form', form.value, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log(response.data,'form data')
            loader.value=false;
            saveBtn.value=false;
            if(response.data.status=='success'){
              success.value=response.data?response.data.message:'Form data successfuly saved.';
              resetForm();
            }else{
              error.value=error.response ? response.data.message : 'An error occurred';
            }
            
          }catch (error) {
          error.value=error.response ? error.response.data.message : 'An error occurred';
          console.log(error.response ? error.response.data.message : 'An error occurred');
          loader.value=false;
          saveBtn.value=false;
          return false;
        }
      }

      const resetForm = ()=>{
        formRef.value.reset();
        form.value=ref({status:true,title:'',description:'',profileImage:'',coverImage:'',type:'66966a030016436b114a41fa',visibility:'public',fields:[{ title: '', type: 'text',required:false,options:[] }]});
        fieldSets.value=[{ title: '', type: 'text',required:false,options:[] }];
      }
      
    }
    return {
      addField,
      form,
      fieldSets,
      removeField,
      updateFieldSet,
      saveForm,
      onProfileImageChange,
      onCoverImageChange,
      loader,
      saveBtn,
      formRef,
      error,
      success
    };
  }
};
</script>