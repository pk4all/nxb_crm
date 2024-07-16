<template>
  <div class="row">
					<div class="col-xl-12">
						<div  class="card">
              <form id="form" action="" method="post" enctype="multipart/form-data">
                <div class="card-header d-flex align-items-center">
                  <h5 class="mb-0">Create New Form</h5>
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
                        <label class="form-label">Title:</label>
                        <input v-model="form.title" type="text" name="title" class="form-control" placeholder="Form title">
										  </div>
                    </div>
                    <div class="col-sm-4">
                      <CategoriesComponent v-model="form.type" />
                    </div>
                    <div class="col-sm-12">
                      <div class="mb-3">
                        <label class="form-label">Description:</label>
                        <textarea id="sescription" class="form-control" name="description" v-model="form.description" placeholder="Form Description"></textarea>
										  </div>
                    </div>
                    <h6>Form Fields</h6>
                    <div class="fields" v-for="(field, index) in form.fields" :key="index">
                      <FieldComponent v-model="field.value" :index="index" @remove="removeField(index)" />
                    </div>
                    <div class="mb-3">
                      <button @click="addField" type="button" class="btn btn-primary btn-icon rounded-pill">
                          <i class="ph-plus"></i>
                      </button>
                  </div>
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
export default {
  data() {
    return {
        
    };
  },
  components: {
    CategoriesComponent,
    FieldComponent
  },
  setup() {
    const fields = ref([]);
    const form=ref({status:false,title:'Test',description:'Test description',type:'66966a030016436b114a41fa',fields:fields});
    const addField = ()=>{
      fields.value.push({});
      form.value.fields=fields;
      console.log(form);
    };
    const removeField = (index) => {
      fields.value.splice(index, 1);
      form.value.fields=fields;
    };
    return {
      addField,
      form,
      fields,
      removeField
    };
  }

};
</script>

<style>
/* Your styles here */
</style>