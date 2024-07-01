Vue.component('custom-fields', {
    props: ['survey_1', 'datas'],
    template: '<div class="new-field">\
                <app-cf v-for="(cf,index) in survey_1.fields"  v-bind:cf="cf" v-bind:index="index"  ></app-cf>\
            <div class="buttons m-t-10">\
                <button type="button" @click="$parent.addField()" class="btn btn-default btn-md waves-effect waves-light m-b-30"><i class="md md-add"></i>Add New</button>\
            </div>\
          </div>'
})
Vue.component('app-cf', {
    props: ['index', 'cf'],
    template: '<div class="form-group m-t-10">\
            <div class="row">\
            <div class="col-md-6"><h4 class="text-dark header-title m-t-0">Custom Field {{index+1}}</h4></div></div>\
              <div class="row">\
              <div class="col-md-3">\
                <label class="form-label" for="">Field Name</label>\
                <input type="text" class="form-control" name="fieldName" value="" v-model="cf.fieldName" required />\
                <span class="err-msg"  v-if="cf.fieldName==\'\'">Please enter field name.</span>\
            </div>\
            <div class="col-sm-4">\
                <label class="control-label">Field Type</label><i class="bar"></i>\
                <select name="fieldType" class="form-select form-control" @change="app.onCfType(cf.type,index)" v-model="cf.type">\
                    <option value="text">Text</option>\
                    <option value="textarea">Textarea</option>\
                    <option value="checkbox">Checkbox</option>\
                    <option value="select">Select Box</option>\
                    <option value="radio">Radio</option>\
                    <option value="file">File</option>\
                    <option value="url">URL</option>\
                    <option value="number">Number</option>\
                    <option value="date">Date</option>\
                    <option value="date_time">Date Time</option>\
                    <option value="date_range">Date Range</option>\
                    <option value="video">Video (Youtube, Vimeo)</option>\
                </select>\
                <span class="err-msg"  v-if="cf.type==\'\'">Please select field type.</span>\
            </div>\
            <div class="col-md-2">\
                <label class="form-label" for="">Required</label>\
                <div>\
                    <input type="checkbox" data-plugin="switchery" data-color="#1bb99a" data-switchery="true" name="fieldRequired" v-model="cf.required">\
                </div>\
            </div>\
            <div class="col-md-2">\
                <label class="form-label" for="">Status</label>\
                <div>\
                    <input class="switchery" type="checkbox" data-plugin="switchery" data-color="#1bb99a" data-switchery="true" name="fieldStatus" ref="switcheryCheckbox" v-model="cf.status">\
                </div>\
            </div>\
            <div class="remove-btn col-sm-1 m-t-10">\
              <a href="javascript:void(0)" @click="app.removeField(index)" class="add-another err-msg"><i class="md md-close fa-2x"></i></a>\
            </div>\
            <div class="col-sm-8" v-if="cf.type==\'checkbox\' || cf.type==\'radio\' || cf.type==\'select\'">\
            <label class="text-dark">All Options</label>\
            <options  v-for="(option,indx) in cf.options"  v-bind:option="option" v-bind:index="indx" v-bind:qindex="index"></options>\
            <div class="buttons">\
                <a href="javascript:void(0)" @click="app.addOption(index)" class="add-another"><i class="fa fa-plus"></i> Add Option</a>\
            </div>\
            </div>\
            </div>\
            <div class="mb-3 m-t-10">\
                <hr style="border: 1px black #5a5858;" class="mt-0 mb-1">\
            </div>\
          </div>'
})
Vue.component('options', {
    props: ['qindex', 'index', 'option'],
    template: '<div class="form-group"><div class="row">\
              <div class="col-sm-10 ">\
              <label class="control-label text-dark">Option Text {{index+1}}</label>\
              <input type="text" class="opt form-control" name="option[{{index}}]" value="" v-model="option.text" required />\
              <span class="err-msg"  v-if="option.text==\'\'">Please enter option value.</span>\
              </div>\
              <div class="remove-btn col-sm-2 m-t-20">\
              <a href="javascript:void(0)" @click="app.removeOption(qindex,index)" class="add-another err-msg"><i class="md md-close fa-2x"></i></a>\
            </div>\
            </div>'
});


//SLoadingBtn.start();
var app = new Vue({
    el: '#addCat',
    data: function() {
        fetch('/admin/category/get-custom-fields/'+catId, {
            method: 'GET'
          })
          .then(response => response.text())
          .then(result => {
            var r = JSON.parse(result);
            console.log(r);
            this.allFields.fields = r;
          }).catch(error => {
            console.error('Error uploading file:', error);
          });
        return {
            allFields:{ fields: [] },
            datas: '',
            error: false
        }
    },
    mounted() {
        
    },
    updated() {
        
    },
    methods: {
        onCfType: function(value, indx) {
            console.log('val',value);
            if (value == 'radio' || value == 'checkbox'|| value == 'select') {
                this.$set(this.allFields.fields[indx], 'options', [{}, {}]);
            } else if (value == 'starrating') {
                this.$set(this.allFields.fields[indx], 'scale', 5);
                this.$set(this.allFields.fields[indx], 'shape', 'star');
                this.$set(this.allFields.fields[indx], 'color', '#d0021b');

                this.$set(this.allFields.fields[indx], 'options', [])
            } else {
                this.$set(this.allFields.fields[indx], 'options', [])
            }
        },
        addField: function() {
            if (this.allFields.fields.length >= 20) {
                alert('Sorry! You can\'t add more question.');
                return false;
            }
            this.allFields.fields.push({ type: 'text',status:true,required:false });
        },
        addOption: function(indx) {
            this.allFields.fields[indx].options.push({});
        },
        removeField: function(indx) {
            this.allFields.fields.splice(indx, 1);
        },
        removeOption: function(qindx, indx) {
            this.allFields.fields[qindx].options.splice(indx, 1);
        },
    },
    computed: {
    }
});

var slugApp = new Vue({
    el: '#slugApp',
    data: function() {
        return {
            name:'',
            datas: '',
        }
    },computed: {
        slug() {
          return this.slugify(this.name);
        }
      },
      methods: {
        slugify(text) {
          return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-');        // Replace multiple - with single -
        }
    }
});

var drf = $('.dropify').dropify();
function updateData(){
    const form = document.getElementById('catForm');
    var catForm = new FormData(form);
    catForm.append('customFields',JSON.stringify(app.allFields.fields)); 
    catForm.append('id',catId); 
    var l = Ladda.create(document.querySelector('#saveBtn'));
    l.start();
    fetch('/admin/category/saveEdit/'+catId, {
        method: 'POST',
        body: catForm
      })
      .then(response => response.text())
      .then(result => {
        l.stop();
        console.log('upload result',result);
        result = JSON.parse(result);
        if(result.status=='success'){
            $('#outMsg').html('<div class="alert alert-success">'+result?.message+'</div>');
            form.reset();
            app.allFields={fields:[]};
        }
        if(result.status=='error'){
            $('#outMsg').html('<div class="alert alert-danger">'+result?.message+'</div>');
        }
      })
      .catch(error => {
        l.stop();
        $('#outMsg').html('<div class="alert alert-danger">'+error?.message+'</div>');
        console.error('Error uploading file:', error);
        
      });

    return false;
}