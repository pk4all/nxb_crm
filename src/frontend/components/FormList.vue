<template>
  <div class="row">
					<div class="col-xl-12">
						<!-- Traffic sources -->
						<div class="card">
							<div class="card-header d-flex align-items-center">
								<h5 class="mb-0">Created Forms</h5>
							</div>
							<div class="card-body pb-0">
                <div class="table-responsive" >
                <table class="table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Eugene</td>
                      <td>Kopyov</td>
                      <td>@Kopyov</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Victoria</td>
                      <td>Baker</td>
                      <td>@Vicky</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>James</td>
                      <td>Alexander</td>
                      <td>@Alex</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Franklin</td>
                      <td>Morrison</td>
                      <td>@Frank</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </tfoot>
                </table>
						  </div>
							</div>
						</div>
						<!-- /traffic sources -->
					</div>
				</div>
</template>
<script>
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
  },
  setup() {

    return {

    };
  }

};
</script>