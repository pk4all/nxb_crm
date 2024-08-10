<template>
  <div class="row">
					<div class="col-xl-12">
						<!-- Traffic sources -->
						<div class="card">
							<div class="card-header d-flex align-items-center">
								<h5 class="mb-0">Form Responses</h5>
							</div>
							<div class="card-body pb-0">
                <div class="table-responsive" >
                <table class="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Id</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(res, index) in data" :key="index">
                      <td>{{index+1}}</td>
                      <td>{{res._id}}</td>
                      <td>{{ formattedDate }}</td>
                      <td>
                        <div class="d-flex align-self-center dropdown ms-3">
                          <a href="#" class="text-body d-inline-flex align-items-center dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="ph-list"></i>
                          </a>
											<div class="dropdown-menu dropdown-menu-end" style="">
                        <a :href="`/form/response-detail/${ res._id }`" class="dropdown-item">
													<i class="ph-eye me-2"></i>
													View Response
												</a>
											</div>
										</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
						  </div>
							</div>
              <div class="card-footer">
                <Pagination
                  :totalItems="pages"
                  :itemsPerPage="limit"
                  v-model="page"
                  @update:modelValue="nextPageData($event)"
                />
                <div class="mb-3" v-if="loading"><i class="ph-spinner spinner ph-2x"></i></div>
                <div class="mb-3" v-if="error">Error: {{ error }}</div>
              </div>
						</div>
						<!-- /traffic sources -->
					</div>
				</div>
</template>
<script>
import { ref } from 'vue';
import axios from 'axios';
import Pagination from './Pagination.vue';
export default {
  data() {
    return {
    };
  },
  methods:{
  },
  components: {
    Pagination
  },
  computed: {
    formattedDate() {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(this.createdAt);
    },
  },
  setup(){
    console.log(formId,'formid');
    const data = ref(null);
    const pages = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const page = ref(1);
    const limit = ref(10);
    const formData = async()=>{
      try {
        const response = await fetch(`/form/responses-list/${formId}?page=${page.value}&limit=${limit.value}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        data.value = json.data;
        pages.value = json.pagination.totalPages;
      } catch (err) {
          error.value = err.message;
      } finally {
          loading.value = false;
      }
    };
    const nextPageData = (newValue)=>{
          page.value=newValue;
          formData();
    };
    formData();
    
    return {
      data,
      pages,
      nextPageData,
      loading,
      error
    };
  }
};
</script>