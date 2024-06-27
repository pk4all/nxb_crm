Vue.component('custom-fields', {
    props: ['survey', 'datas'],
    template: '<div class="new-field">\
                <app-cf v-for="(question,index) in survey.questions"  v-bind:question="question" v-bind:index="index"  v-bind:questionTypes="datas.questionTypes" ></app-cf>\
            <div class="buttons m-t-10">\
                <button type="button" @click="$parent.addField()" class="btn btn-default btn-md waves-effect waves-light m-b-30"><i class="md md-add"></i>Add New</button>\
            </div>\
          </div>'
})
Vue.component('app-cf', {
    props: ['index', 'question', 'questionTypes'],
    template: '<div class="form-group m-t-10">\
            <div class="row"><div class="col-md-6"><h4 class="text-dark header-title m-t-0">Custom Field {{index+1}}</h4></div></div>\
              <div class="row">\
              <div class="col-md-3">\
                <label class="form-label" for="">Field Name</label>\
                <input type="text" class="form-control" name="fieldName" value="" v-model="question.fieldName" required />\
                <span class="err-msg"  v-if="question.fieldName==\'\'">Please enter question.</span>\
            </div>\
            <div class="col-sm-4">\
                <label class="control-label">Field Type</label><i class="bar"></i>\
                <select name="fieldType" class="form-select form-control">\
                    <option value="text">Text</option>\
                    <option value="textarea">Textarea</option>\
                    <option value="checkbox">Checkbox</option>\
                    <option value="checkbox_multiple">Checkbox (Multiple)</option>\
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
                <span class="err-msg"  v-if="question.type==\'\'">Please select question type.</span>\
            </div>\
            <div class="col-md-2">\
                <label class="form-label" for="">Required</label>\
                <div>\
                    <input type="checkbox" data-plugin="switchery" data-color="#1bb99a" data-switchery="true" name="fieldRequired">\
                </div>\
            </div>\
            <div class="col-md-2">\
                <label class="form-label" for="">Status</label>\
                <div>\
                    <input class="switchery" type="checkbox" checked="" data-plugin="switchery" data-color="#1bb99a" data-switchery="true" name="fieldStatus" ref="switcheryCheckbox">\
                </div>\
            </div>\
            <div class="remove-btn col-sm-1 m-t-30">\
              <a href="javascript:void(0)" @click="surveyApp.removeQuestion(index)" class="add-another err-msg"><i class="md md-close"></i></a>\
            </div>\
            <div class="col-sm-8" v-if="question.type==\'checkbox\' || question.type==\'radiobutton\'">\
            <label class="text-dark">All Options</label>\
            <question-option  v-for="(option,indx) in question.options"  v-bind:option="option" v-bind:index="indx" v-bind:qindex="index"></question-option>\
            <div class="buttons">\
                <a href="javascript:void(0)" @click="surveyApp.addOption(index)" class="add-another"><i class="fa fa-plus"></i> Add Option</a>\
            </div>\
            </div>\
            <div class="col-sm-8" v-if="question.type==\'starrating\'">\
            <star-option  v-bind:question="question" v-bind:index="index"></star-option>\
            </div>\
            </div>\
          </div>'
})
Vue.component('question-option', {
    props: ['qindex', 'index', 'option'],
    template: '<div class="form-group"><div class="row">\
              <div class="col-sm-10">\
              <input type="text" class="opt form-control" name="option" value="" v-model="option.text" required />\
              <label class="control-label text-dark">Option Text</label><i class="bar"></i>\
              <span class="err-msg"  v-if="option.text==\'\'">Please enter option value.</span>\
              </div>\
              <div class="remove-btn col-sm-2">\
              <a href="javascript:void(0)" @click="surveyApp.removeOption(qindex,index)" class="add-another err-msg"><i class="fa fa-trash-o fa-2x"></i></a>\
            </div>\
            </div>'
})

Vue.component('star-option', {
    props: ['index', 'question'],
    template: '<div class="form-group">\
            <div class="row">\
            <div class="col-sm-2">\
            <label class="text-dark">Scale</label>\
            <select class="form-select" name="scale" v-model="question.scale">\
              <option value="2">2</option>\
              <option value="3">3</option>\
              <option value="4">4</option>\
              <option value="5">5</option>\
              <option value="6">6</option>\
              <option value="7">7</option>\
              <option value="8">8</option>\
              <option value="9">9</option>\
              <option value="10">10</option>\
            </select>\
            <i class="bar"></i>\
            </div>\
            <div class="col-sm-3">\
            <label class="text-dark">Shape</label>\
            <select class="form-select"  name="shape" v-model="question.shape">\
              <option value="star">Star</option>\
              <option value="smile-o">Smiley</option>\
              <option value="heart">Heart</option>\
              <option value="thumbs-up">Thumb</option>\
            </select>\
            <i class="bar"></i>\
            </div>\
            <div class="col-sm-2">\
            <label class="text-dark">Color</label>\
            <input class="color" type="color" name="color" v-model="question.color">\
            </div>\
            <div class="col-sm-2">\
            <label v-bind:style="{fontSize:\'36px\',color:question.color,paddingTop:\'5px\',marginTop:\'10px\'}"><i :class="\'fa fa-\'+question.shape"></i></label>\
            </div>\
            </div>\
            </div>'
})


//SLoadingBtn.start();
var surveyApp = new Vue({
    el: '#addCat',
    data: function() {
        // this.$http.get("/get-form-categories").then((response) => {
        //     this.datas = response.data;
        // });
        // if (surveyId) {
        //     this.$http.get("/get-form/" + surveyId).then((response) => {
        //         this.survey = response.data;
        //     });
        // }
        return {
            survey: { surveyType: 'Community feedback', questions: [] },
            datas: '',
            error: false
        }
    },
    mounted() {
        
      },
      updated() {
        
      },
    methods: {
        onQustType: function(value, indx) {
            if (value == 'radiobutton' || value == 'checkbox') {
                this.$set(this.survey.questions[indx], 'options', [{}, {}]);
            } else if (value == 'starrating') {
                this.$set(this.survey.questions[indx], 'scale', 5);
                this.$set(this.survey.questions[indx], 'shape', 'star');
                this.$set(this.survey.questions[indx], 'color', '#d0021b');

                this.$set(this.survey.questions[indx], 'options', [])
            } else {
                this.$set(this.survey.questions[indx], 'options', [])
            }
        },
        addField: function() {
            if (this.survey.questions.length >= 20) {
                alert('Sorry! You can\'t add more question.');
                return false;
            }
            this.survey.questions.push({ type: 'textbox' });
           
        },
        addOption: function(indx) {
            this.survey.questions[indx].options.push({});
        },
        removeQuestion: function(indx) {
            this.survey.questions.splice(indx, 1);
        },
        removeOption: function(qindx, indx) {
            this.survey.questions[qindx].options.splice(indx, 1);
        },
        saveSurvey: function() {
            // var SLoadingBtn = Ladda.create(document.querySelector('#save'));
            surveyApp.error = false;
            if (!this.survey.title) {
                this.$set(this.survey, 'title', '');
                surveyApp.error = true;
            }
            if (this.survey.questions.length > 0) {
                this.survey.questions.forEach((ques, indx) => {
                    if (!ques.question) {
                        surveyApp.$set(surveyApp.survey.questions[indx], 'question', '');
                        surveyApp.error = true;
                    }
                    if (surveyApp.survey.questions[indx].type == 'checkbox' || surveyApp.survey.questions[indx].type == 'radiobutton') {
                        surveyApp.survey.questions[indx].options.forEach((opt, OptIndx) => {
                            if (!opt.text) {
                                surveyApp.$set(surveyApp.survey.questions[indx].options[OptIndx], 'text', '');
                                surveyApp.error = true;
                            }
                        })
                    }
                });
            }
            if (surveyApp.error) {
                return false;
            }
            // this.$http.post('/user/save-data', {
            //     data: surveyApp.survey
            // }).then(function(response) {
            //     if (response.data.status == 'success') {
            //         window.location.href = '/user/form';
            //     }
            // });
        }
    },
    computed: {
        options: function(indx) {
            // console.log(indx);
        }
    }
});