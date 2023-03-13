<template xmlns:el-col="http://www.w3.org/1999/html">
    <div class="main">
      <div class="top">
        <div class="el-col-10">
          <el-input
            placeholder="请输入关键字（名称）搜索"
            prefix-icon="el-icon-search"
            v-model="searchBoxValue">
          </el-input>
        </div>
        <div class="el-col-3">
          <el-select v-model="selectBoxValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="el-col-2">
          <el-button @click="filterTable(selectBoxValue)" type="warning" v-model="selectBoxValue">搜索</el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          ref="filterTable"
          :data="tableNewData.filter(data => !searchBoxValue || data.name.toLowerCase().includes(searchBoxValue.toLowerCase()))"
          border
          style="width: 100%">
          <el-table-column
            fixed
            prop="num"
            type="index"
            label="序号"
            width="150">
          </el-table-column>
          <el-table-column
            fixed
            prop="name"
            label="功能特色名称"
            width="220">
          </el-table-column>
          <el-table-column
            prop="content"
            label="功能特色描述"
            width="500">
          </el-table-column>
          <el-table-column
            prop="webStatus"
            label="功能特色状态"
            v-model="selectBoxValue"
            :filters="[{ text: '审核中', value: '管理员提交待县局审核' }, { text: '公司', value: '公司' }]"
            :filter-method="filterTag"
            width="260">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="240">
            <template slot-scope="scope">
              <PermButton size="small"  label='查看'  @click="handleClick(scope.row)" perms='view' type="primary"/>
              <PermButton v-if="scope.row.dataStatus === '0'" size="small"  label='提交'  @click="confirm(scope.row,'submit','提交后，信息将无法修改，是否确认提交')" perms='update' type="danger"/>
              <PermButton v-if="scope.row.dataStatus !== '0'" size="small"  label='取消提交'  @click="confirm(scope.row,'cancel','取消提交将重置所有审核记录，是否确认取消')" perms='delete' type="danger"/>
              <PermButton v-if="scope.row.dataStatus === '7'" size="small"  label='发布到小程序'  @click="confirm(scope.row,'submit','是否确认发布到小程序')" perms='update' type="danger"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
import PermButton from "../component/PermButton";
export default {
  name: "Feature",
  components: {PermButton},
  data() {
    return {
      tableData: [{
        //表格原始数据，用于存储原始表格信息
      }],
      tableNewData:[{
        //表格渲染数据，直接渲染到视图
      }],
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '保存',
        label: '保存'
      }, {
        value: '审核中',
        label: '审核中'
      }, {
        value: '审核未通过',
        label: '审核未通过'
      }, {
        value: '已上架',
        label: '已上架'
      }, {
        value: '已下架',
        label: '已下架'
      }],
      selectBoxValue: '全部',
      searchBox: '',
      roleName: '县级',
      Status: '1',
      userCode: '9f1992a0-f60d-4738-b15e-b17e8e10717e'
      // userCode: '0022f7a3-9610-4747-b8c5-4bc771ebd288'
    }
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    confirm(value,type,message) {
      var val = value //传参
      var msg = message //错误信息
      var flag = type //需要进入的方法
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if(flag === 'submit'){
          this.statusUpdate(val)
        }else if(flag === 'cancel'){
          this.submitCancel(val)
        }
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '数据异常，请重试'
        });
      });
    },
    statusUpdate(row) {//提交状态改变
      if(row.dataStatus==='0'){
        row.dataStatus = '1'
      }else if(row.dataStatus==='1'){
        row.dataStatus = '3'
      }else if(row.dataStatus==='3'){
        row.dataStatus = '5'
      }else if(row.dataStatus==='5'){
        row.dataStatus = '7'
      }else if(row.dataStatus==='7'){
        row.dataStatus = '8'
      }
      this.axios.put('http://localhost:9090/updateProject', {
        itemid: row.itemid,
        itemcode: row.itemcode,
        dataStatus: row.dataStatus
      }).then(res => {
        this.refreshTable()
        console.log("请求成功")
      }).catch(() => {
        console.log("请求失败了")
      })
    },
    submitCancel(row) {//取消提交
      row.dataStatus = '0'
      this.axios.put('http://localhost:9090/updateProject', {
        itemid: row.itemid,
        itemcode: row.itemcode,
        dataStatus: row.dataStatus
      }).then(res => {
        this.refreshTable()
        console.log("请求成功")
      }).catch(() => {
        console.log("请求失败了")
      })
    },
    hasPerms: function (perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms)
    },
    getPermission(){ // 模拟接口 获取 权限数据集合
      let perms = ['search','view','update','delete'];
      this.$store.dispatch("SET_PERMISSION",perms);
    },
    refreshTable(){//刷新表格
      var allProject;
      this.axios.get('http://localhost:9090/hello', {
        params: {
          status: this.Status,
          userCode: this.userCode
        }
      }).then(res => {
        allProject = res.data
        this.tableInit(allProject)
      }).catch(() => {
        console.log(error)
        console.log("请求失败了")
      })
    },
    tableInit: function (tableItems) {
      //初始化表格信息
      tableItems.forEach(function (i, index) {
        if (i.dataStatus === '0') {
          i.webStatus = '保存'
        } else if (i.dataStatus === '1') {
          i.webStatus = '管理员提交待县局审核'
        } else if (i.dataStatus === '2') {
          i.webStatus = '县局审核不通过'
        } else if (i.dataStatus === '3') {
          i.webStatus = '县局审核通过待市局审核'
        } else if (i.dataStatus === '4') {
          i.webStatus = '市局审核不通过'
        } else if (i.dataStatus === '5') {
          i.webStatus = '市局审核通过待省局审核'
        } else if (i.dataStatus === '6') {
          i.webStatus = '省局审核不通过'
        } else if (i.dataStatus === '7') {
          i.webStatus = '省局审核通过待管理员确认发布到小程序'
        } else if (i.dataStatus === '8') {
          i.webStatus = '管理员确认发布到小程序'
        } else if (i.dataStatus === '9') {
          i.webStatus = '从小程序上下架'
        }
      })
      this.tableData = tableItems;
      this.tableNewData = tableItems;
    },
    filterTag(value, row) {
      console.log(value)
      console.log(row)
      return row.webStatus === value
    },
    filterTable:function (value){
      if(value === '全部'){
        return this.tableNewData = this.tableData
      }else if(value === '保存' ){
        this.tableNewData = this.tableData.filter(function(i){
          return i.dataStatus === '0'
        })
        return this.tableNewData
      }else if(value === '审核中'){
        return this.tableNewData = this.tableData.filter(function(i){
          return i.dataStatus === '1' || i.dataStatus === '3' || i.dataStatus === '5' || i.dataStatus === '7'
        })
      }else if(value === '审核未通过' ){
        this.tableNewData = this.tableData.filter(function(i){
          return i.dataStatus === '2' || i.dataStatus === '4' || i.dataStatus === '6'
        })
        return this.tableNewData
      }else if(value === '已上架' ){
        this.tableNewData = this.tableData.filter(function(i){
          return i.dataStatus === '8'
        })
        return this.tableNewData
      }else if(value === '已下架' ){
        this.tableNewData = this.tableData.filter(function(i){
          return i.dataStatus === '9'
        })
        return this.tableNewData
      }

    }
  },
  created: function () {
    var allProject;
    // this.axios.get('http://localhost:9090/selectchaAll?status=1&userCode=9f1992a0-f60d-4738-b15e-b17e8e10717e').then(function(res){})
    this.axios.get('http://localhost:9090/hello', {
      params: {
        status: this.Status,
        userCode: this.userCode
      }
    }).then(res => {
      allProject = res.data
      this.tableInit(allProject)
    }).catch(() => {
      console.log(error)
      console.log("请求失败了")
    })
  },
  mounted() {
    this.getPermission()
  }
}
</script>
<style scoped>
</style>
