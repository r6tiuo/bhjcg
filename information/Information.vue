<template>
  <div>
    <div class="el-col-24 marginUp10">国医堂信息修改</div>
    <div class="el-col-24 marginUp10">
      <div class="el-col-4 right">国医堂照片：</div>
      <div class="el-col-10 left">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img style="width: 100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
    <div class="el-col-24 marginUp20">
      <div class="el-col-12">
        <div class="el-col-8 right marginUp10">国医堂名称：</div>
        <div class="el-col-16 left"><el-input v-model="HOSPITAL.HOSPITAL_NAME" placeholder="请输入国医堂" style="width: 60%"/></div>
      </div>
      <div class="el-col-12">
        <div class="el-col-4 marginUp10">联系电话：</div>
        <div class="el-col-20 left"><el-input v-model="HOSPITAL.HOSPITAL_PHONE" placeholder="请输入电话号码" style="width:60%"/></div>
      </div>
    </div>
    <div class="el-col-24 marginUp20">
      <div class="el-col-4 right marginUp10">详细地址：</div>
      <div class="el-col-16">
        <div class="el-col-5">
          <el-select id="s_province" v-model="HOSPITAL.HOSPITAL_PRO" @change="selectProvinceFun($event)" placeholder="请选择省份" style="width: 100%">
            <el-option value="" label="请选择省份"></el-option>
            <el-option :value="item" :label="item.value" v-for="(item, index) in city" :key="index"></el-option>
          </el-select>
        </div>
        <div class="el-col-5">
          <el-select id="s_city"  v-model="HOSPITAL.HOSPITAL_CITY" @change="selectCityFun($event)" placeholder="请选择城市" style="width: 100%">
            <el-option value="" label="请选择城市"></el-option>
            <el-option :value="item" :label="item.value" v-for="(item, index) in cityList" :key="index"></el-option>
          </el-select>
        </div>
        <div class="el-col-5">
          <el-select id="s_county" v-model="HOSPITAL.HOSPITAL_COUNTRY" @change="selectAreaFun($event)" placeholder="请选择区县" style="width: 100%">
            <el-option value="" label="请选择区县"></el-option>
            <el-option :value="item" :label="item.value" v-for="(item, index) in areaList" :key="index"></el-option>
          </el-select>
        </div>
        <div class="el-col-9"><el-input v-model="HOSPITAL.HOSPITAL_ADRESS" placeholder="详细地址" style="width: 100%"/></div>
      </div>
      <div class="el-col-4"></div>
    </div>
    <div class="el-col-24 marginUp20">
      <div class="el-col-4 right">简介：</div>
      <div class="el-col-16">
        <el-input v-model="HOSPITAL.INTRODUCE" type="textarea" :rows="5"></el-input>
      </div>
    </div>
    <div class="el-col-24 marginUp20">
      <div class="el-col-4">&emsp;</div>
      <div class="el-col-16 right">
        <el-button type="primary">返回</el-button>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary">提交</el-button>
      </div>
      <div class="el-col-4"></div>
    </div>
  </div>
</template>

<script>
    import city from '../../utils/address.json'
    export default {
        name: "Information",
        data(){
            return{
                // 整个省市县数据
                city: city,
                // 被选中的市数据
                cityList: [],
                // 被选中的县数据
                areaList: [],
                selectProvince: {},
                selectCity: {},
                selectArea: {},
                HOSPITAL:{
                    HOSPITAL_NAME:'',
                    HOSPITAL_PHONE:'',
                    HOSPITAL_PRO:{},
                    HOSPITAL_CITY:{},
                    HOSPITAL_COUNTRY:{},
                    HOSPITAL_ADRESS:'',
                    INTRODUCE:''
                },
                //图像属性
                dialogImageUrl: '',
                dialogVisible: false
            }
        },
        methods:{
            // 图像事件
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            // 省份 市 县联动
            selectProvinceFun (event) {
                console.log(event)
                if (event) {
                    this.cityList = event.children
                } else {
                    this.cityList = []
                }
                this.areaList = []
                this.$emit('getLawyerListInfo', [event.value, 'province'])
            },
            selectCityFun (event) {
                console.log(event)
                if (event) {
                    this.areaList = event.children
                } else {
                    this.areaList = []
                }
                this.$emit('getLawyerListInfo', [event.value, 'city'])
            },
            selectAreaFun (event) {
                console.log(event)
                this.$emit('getLawyerListInfo', [event.value, 'area'])
            },

            //保存
            save(){
                console.log("SSSSSSSS")
                console.log(this.HOSPITAL)
                this.axios({
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    method:'POST',
                    url:'http://localhost:8080/insertInformation.do',
                    // url:'http://localhost:8080/login.do?username='+this.loginForm.account+'&password='+this.loginForm.password,
                    // data:JSON.stringify({kk1:this.HOSPITAL_NAME, kk2:this.HOSPITAL_PHONE})
                    data:{
                        hospital_name:this.HOSPITAL.HOSPITAL_NAME,
                        hospital_phone:this.HOSPITAL.HOSPITAL_PHONE,
                        hospital_pro:this.HOSPITAL.HOSPITAL_PRO.value,
                        hospital_city:this.HOSPITAL.HOSPITAL_CITY.value,
                        hospital_country:this.HOSPITAL.HOSPITAL_COUNTRY.value,
                        hospital_adress:this.HOSPITAL.HOSPITAL_ADRESS,
                        introduce:this.HOSPITAL.INTRODUCE
                    }
                }).then(res =>{
                    console.log("请求成功")
                }).catch(()=>{
                    console.log(error)
                    console.log("请求失败了")
                })
            }
        }
    }
</script>

<style scoped>
  .right {
    text-align: right;
  }

  .left {
    text-align: left;
  }

  .marginUp20{
    margin: 20px 0 0 0;
  }

  .marginUp10{
    margin: 10px 0 0 0;
  }

</style>
