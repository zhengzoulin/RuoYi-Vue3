<template>
  <div class="app-container home">

    <el-row :gutter="22">
      <el-col :span="19">
        <el-card class="card-left">
          <template v-slot:header>
            <div class="clearfix">
              <span>郑邹林 中文好</span>
            </div>
          </template>
          <div class="body">
            今天任务xxxxx

          </div>
        </el-card>

        <el-card class="card-left">
          <template v-slot:header>
            <div class="clearfix">
              <span>流程图</span>
            </div>
          </template>
          <div class="body">
            管理员 维护公司 添加用户 维护权限
            产品经理 创建产品 维护模块 维护计划 维护需求 创建发布
            项目经理 创建项目 维护团队 关联产品 关联需求 分解任务
            研发人员 领取任务和Bug 更新状态 完成任务和Bug
            测试人员 撰写用例 执行用例 提交Bug 验证Bug 关闭Bug
          </div>
        </el-card>

        <el-card class="card-left">
          <template v-slot:header>
            <div class="clearfix">
              <span>流程图</span>
            </div>
          </template>
          <div class="body">
            管理员 维护公司 添加用户 维护权限
            产品经理 创建产品 维护模块 维护计划 维护需求 创建发布
            项目经理 创建项目 维护团队 关联产品 关联需求 分解任务
            研发人员 领取任务和Bug 更新状态 完成任务和Bug
            测试人员 撰写用例 执行用例 提交Bug 验证Bug 关闭Bug
          </div>
        </el-card>
        <el-card class="card-left">
          <template v-slot:header>
            <div class="clearfix">
              <span>产品统计</span>
            </div>
          </template>
          <div class="body">
            xxx   xxx   嘻嘻嘻

          </div>
        </el-card>

      </el-col>

      <el-col :span="5">
        <el-card class="card-right">
          <template v-slot:header>
            <div class="clearfix">
              <span> 最近动态</span>
            </div>
          </template>
          <div class="body">
            2月06日 11:23 郑邹林 登录系统
            2月06日 11:22 刘培战 登录系统
            2月06日 11:10 喻苑恒 登录系统
            2月06日 10:27 张棋 登录系统
            2月06日 10:09 周兵 登录系统
            2月06日 09:52 蔡超 开始了 任务 客户专员专属服务
          </div>
        </el-card>
        <el-card class="card-right">
          <template v-slot:header>
            <div class="clearfix">
              <span> 我的代办</span>
            </div>
          </template>
          <div class="body">
            xxxxx剩余xx工时

          </div>
        </el-card>
        <el-card class="card-right">
          <template v-slot:header>
            <div class="clearfix">
              <span>产品预览</span>
            </div>
          </template>
          <div class="body">
            xxxx参评产品产品
          </div>
        </el-card>
        <el-card class="card-right">
          <template v-slot:header>
            <div class="clearfix">
              <span> 指派任务</span>
            </div>
          </template>
          <div class="body">
           xxxx任务任务
            任务
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
const version = ref('3.8.7')


</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .card-left {
   margin-bottom: 15px;
  }
  .card-right{
    margin-bottom: 15px;
  }

}
</style>

