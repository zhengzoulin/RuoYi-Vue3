<template>


  <template>


    <div class="app-container">
      <el-row>
        <el-button>
          <i class="el-icon-back"></i>
          <span>返回</span>
        </el-button>

        <div>
          <div>
            <el-button>审核并通过</el-button>
            <el-button>保存</el-button>
          </div>
        </div>
      </el-row>
      <div-row>
        <el-form :model="queryParams" :inline="true">
          <div>Bom基本信息<el-button><span>收缩</span></el-button></div>
          <div>
            <el-row>
              <el-from-item label="所属仓库">
                <el-input

                    placeholder="请输入仓库"
                    clearable
                />
              </el-from-item>
              <el-from-item label="BOM表编号">
                <el-input

                    placeholder="请输入BOM表编号"
                    clearable
                />
              </el-from-item>
              <el-from-item label="BOM表备注">
                <el-input

                    placeholder="请输入BOM表备注"
                    clearable
                />
              </el-from-item>
              <el-from-item label="单据名称">
                <el-input

                    placeholder="请输入单据名称"
                    clearable
                />
              </el-from-item>
            </el-row>

            <div>Bom成品信息<el-button><span>重置</span></el-button></div>

            <el-row>
              <el-from-item label="成品商品名称">
                <el-input

                    placeholder="请输入成品商品名称"
                    clearable
                />
              </el-from-item>
              <el-from-item label="封装规格">
                <el-input

                    placeholder="请输入封装规格"
                    clearable
                />
              </el-from-item>
              <el-from-item label="厂家型号">
                <el-input

                    placeholder="请输入厂家型号"
                    clearable
                />
              </el-from-item>
              <el-from-item label="成品商品编号">
                <el-input

                    placeholder="请输入成品商品编号"
                    clearable
                />
              </el-from-item>
            </el-row>
            <el-row>
              <el-from-item label="包装单位">
                <el-input

                    placeholder="请输入包装单位"
                    clearable
                />
              </el-from-item>
              <el-from-item label="最小包装单位">
                <el-input

                    placeholder="请输入最小包装单位"
                    clearable
                />
              </el-from-item>
              <el-from-item label="品牌">
                <el-input

                    placeholder="请输入品牌"
                    clearable
                />
              </el-from-item>
              <el-from-item label="商品目录">
                <el-input

                    placeholder="请输入商品目录"
                    clearable
                />
              </el-from-item>
            </el-row>

            <el-row>
              <el-from-item label="重量">
                <el-input

                    placeholder="请输入重量"
                    clearable
                />
              </el-from-item>
              <el-from-item label="备注">
                <el-input

                    placeholder="请输入备注"
                    clearable
                />
              </el-from-item>
            </el-row>
          </div>
        </el-form>

        <div>Bom用料信息<el-button><span>重置</span></el-button></div>

        <el-row>
          <el-button>导入BOM表</el-button>
          <el-button>下载BOM模板</el-button>
          <el-button></el-button>

        </el-row>

        <el-row>
          <span>BOM总数：{{}}</span>
          <span>BOM总成本：￥{{}}</span>

        </el-row>

        <el-from>
          <el-table>

          </el-table>
          <el-row>
            <el-button>
              <span>+新增行</span>
            </el-button>
          </el-row>
        </el-from>


      </div-row>


    </div>
  </template>

  <script setup>


    import {ref} from "vue";

    const data = reactive({
      form: {
      },

      queryParams: {
        pageNum: 1,
        pageSize: 10,
        purchaseOrderCode: null,
        purchaseOrderName: null,
      }
    });

    const { queryParams, form, } = toRefs(data);
  </script>

  <style scoped>

  </style>


</template>

<script setup>


import {useRoute} from "vue-router";

const route = useRoute()
console.log(route.query)

</script>

<style scoped>

</style>