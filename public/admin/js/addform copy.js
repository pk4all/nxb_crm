//Vue.prototype.$http = axios
Vue.component('survey', {
    props: ['survey', 'datas'],
    template: '<div class="new-survey">\
            <div class="form-group">\
            <div class="row">\
            <div class="col-sm-12"><h6>Basic Details</h6></div>\
              <div class="col-sm-8">\
              <div class="form-group">\
                <label class="control-label text-dark" for="survey_title">Title</label><i class="bar"></i>\
                <input id="survey_title" type="text" class="form-control" name="title" value="" v-model="survey.title" required />\
                <span class="err-msg" v-if="survey.title==\'\'">Please enter title.</span>\
              </div>\
              <div class="form-group">\
              <label class="control-label text-dark" for="survey_notes">Description (Optional)</label><i class="bar"></i>\
              <textarea id="survey_notes" class="form-control" name="notes" value="" v-model="survey.notes"></textarea>\
              </div>\
              </div>\
              <div class="col-sm-4">\
                <div class="form-group">\
                <label class="control-label text-dark" for="survey_type">Type</label><i class="bar"></i>\
                  <select class="form-select" name="survey_type" v-model="survey.surveyType" required >\
                    <option value="">Select a Type</option>\
                    <option v-for="item in datas.surveyCategories" :value="item.name" :key="item._id">{{item.name}}</option>\
                  </select>\
                  <i class="bar"></i>\
                  <span class="err-msg" v-if="survey.survey_type==\'\'">Select a type.</span>\
                </div>\
              </div>\
            </div>\
            </div>\
            <hr class="line">\
            <div class="col-sm-12" v-if="survey.questions.length>0"><h6>Fields Details</h6></div>\
            <app-question v-for="(question,index) in survey.questions"  v-bind:question="question" v-bind:index="index"  v-bind:questionTypes="datas.questionTypes" ></app-question>\
            <div class="buttons m-t-10">\
                <a href="javascript:void(0)" @click="$parent.addQuestion()" class="add-another"><i class="fa fa-plus"></i> ADD New Field</a>\
            </div>\
          </div>'
})
Vue.component('app-question', {
    props: ['index', 'question', 'questionTypes'],
    template: '<div class="form-group m-t-10">\
              <div class="row">\
              <div class="col-sm-8">\
              <label class="control-label text-dark">{{index+1}}-Question</label><i class="bar"></i>\
              <input type="text" class="form-control" name="question" value="" v-model="question.question" required />\
              <span class="err-msg"  v-if="question.question==\'\'">Please enter question.</span>\
            </div>\
            <div class="col-sm-3">\
              <div class="form-group">\
                <label class="control-label text-dark">Field Type</label><i class="bar"></i>\
                <select class="form-select" @change="surveyApp.onQustType(question.type,index)" name="question_type" v-model="question.type" required >\
                  <option v-for="item in questionTypes" :value="item.type" :key="item.type">{{item.lable}}</option>\
                </select>\
                <i class="bar"></i>\
              </div>\
              <span class="err-msg"  v-if="question.type==\'\'">Please select question type.</span>\
            </div>\
            <div class="remove-btn col-sm-1 m-t-30">\
              <a href="javascript:void(0)" @click="surveyApp.removeQuestion(index)" class="add-another err-msg"><i class="fa fa-trash-o fa-2x"></i></a>\
            </div>\
            <div class="required-option col-sm-12">\
            <div class="checkbox" style="display: flex;">\
              <input v-bind:id="\'chk-\'+index" class="required-checkbox" type="checkbox" name="required" v-model="question.required">\
              <label v-bind:for="\'chk-\'+index">Require an Answer to this Question</label>\
            </div>\
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
        addQuestion: function() {
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