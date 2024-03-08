<template>
<div>
  <el-dialog :title="props.title" v-model="props.openAddOrderStockDetail"
             append-to-body class="dialog-addOrder" style="position: relative;">

    <el-row :gutter="10" class="mb8" style="border-top: dashed 1.3px rgba(187,199,191,0.35) ; padding: 8px">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Edit"
            :disabled="props.updateOrderShow"
            v-hasPermi="['erp:order:add']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            :disabled="props.orderAuditShow"
            v-hasPermi="['erp:order:edit']"
        >审核通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="props.orderAuditShow"
            v-hasPermi="['erp:order:remove']"
        >审核不通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            plain
            type="primary"
            icon="Download"
            @click="handleExport"
            v-hasPermi="['erp:order:export']"
        >打印</el-button>
      </el-col>

    </el-row>

    <span > 入库单基本信息
        <el-button link type="primary" icon="list" @click="changeOrderShow"> {{ orderDetailFormShow ? '收起' : '详细' }}</el-button>
      </span>


    <br>
    <div style="margin-top: 10px "> <span >采购订单信息 </span>
      <el-button
          type="primary"
          plain
          icon="Plus"
          size="small"
          style="margin-left: 10px;"
          @click="handleSelectOrder"
      >选择采购订单</el-button>
    </div>

    <el-table
              :data="props.selectedOrder"
              height="150px"
     >

      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="采购订单编号" align="center" prop="purchaseOrderId">
        <template #default="scope">
          <!-- 使用 <a> 标签来包装数据，并添加样式 -->
          <a
              href="#"
              style="color: rgba(40,177,232,0.83); text-decoration: underline;"
              @click="handleOrderDetailClick(scope.row)"
          >
            {{ scope.row.purchaseOrderCode }}
          </a>
        </template>
      </el-table-column>

      <el-table-column label="单据名称" align="center" prop="purchaseOrderName"/>

      <el-table-column label="下单日期" prop="createTime" align="center" />
      <el-table-column label="交货日期" prop="purchaseOrderTime" />
      <!--          <template #default="scope">-->
      <!--            <span>-->
      <!--              <el-input v-model="scope.row.demandNumber" @input="calculateorderMoney(scope.row)" type="number" maxlength="26" placeholder="请输入需求" size="mini"  />-->
      <!--            </span>-->
      <!--          </template>-->

      <el-table-column label="供应商" align="center" prop="unit.unitName"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="danger" icon="delete" @click="removeOrderRow(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 10px "> <span >采购入库商品明细 </span>
      <el-button
          type="danger"
          plain
          icon="Plus"
          size="small"
          style="margin-left: 10px;"
          @click="handleAddProduct"
          v-hasPermi="['erp:order:add']"
      >移出明细</el-button>
    </div>

    <br>
    <span style="margin-top:50px"> 入库种数：       入库总额：</span>
    <!--      待入库商品明细表格-->
    <el-table
              :data="props.orderProductsList"
              height="350"
              class="productAddDetailTable"
              style="border: dashed 1.3px rgba(187,199,191,0.35);margin-top: 8px;padding: 3px"
           >

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column label="编号" align="center" prop="product.productCode"/>

      <el-table-column label="商品信息" align="center" prop="product.productName"/>
      <el-table-column label="可入库数量" prop="demandNumber" align="center" >

      </el-table-column>

      <el-table-column label="金额" prop="orderMoney" align="center" class="select-container"/>
      <el-table-column label="成本价" align="center" prop="costPrice" width="80px">
        <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.costPrice"  type="number" maxlength="20" placeholder="请输入"  size="mini"  />
                  </span>
        </template>
      </el-table-column>

      <el-table-column label="备注" prop="remark" align="center"  width="90px"/>

      <el-table-column label="入库数量" prop="demandNumber" align="center"  width="120px">
        <template #default="scope">
                  <span>
                    <el-input v-model="scope.row.demandNumber"  type="number" maxlength="20" placeholder="请输入需求" size="mini"  />
                  </span>
        </template>
      </el-table-column>

      <el-table-column label="入库位置相关信息" align="center" width="240px">
        <template #default="scope">
          <a
              href="#"
              class="custom-link-style"
              v-html="String.raw`${formatBatchPosition(scope.row.batchPositionList, props.PositionOptions)}`"
          ></a>
        </template>
      </el-table-column>


    </el-table>
  </el-dialog>
</div>
</template>

<script setup>





// *********************
// 接收父组件传递过来的值
import {defineEmits, defineProps} from "vue";

const props = defineProps({

  openAddOrderStockDetail:{
    type:Boolean,
    default: false
  },
  orderProductsList:{
    type:Array,
    default:[]
  },
  form:{
    type:Object,
    default:{}
  },
  selectedOrder:{
    type:Array,
    default:[]
  },
  title:{
    type:String
  },
  orderAuditShow:{
    type:Boolean,
    default: true
  },
  updateOrderShow:{
    type:Boolean,
    default: true
  },
  PositionOptions:{
    type:Array,
    default:[]
  }

})



// 接收父组件传递过来的方法--------------------------------------------------------------------------
const emit = defineEmits(['handleSelectionChange','handleOrderDetailClick'])


function handleOrderDetailClick(row){
  emit('handleOrderDetailClick', row)
}

function formatBatchPosition(batchPositionList, PositionOptions) {
  if (Array.isArray(batchPositionList) && batchPositionList.length > 0) {
    const formattedList = batchPositionList.map(item => {
      const selectedLabels = [];

      if (Array.isArray(item.selectValue)) {
        const [warehouseId, positionId] = item.selectValue;

        // 在 PositionOptions 中查找对应的仓库信息
        const foundWarehouse = PositionOptions.find(option => option.id === warehouseId);
        if (foundWarehouse) {
          selectedLabels.push(foundWarehouse.label); // 添加仓库名称

          // 如果存在库位 ID，则在仓库的 children 中查找对应的库位信息
          if (positionId) {
            const foundPosition = foundWarehouse.children.find(child => child.id === positionId);
            if (foundPosition) {
              selectedLabels.push(foundPosition.label); // 添加库位名称
            } else {
              selectedLabels.push('N/A'); // 如果未找到对应库位信息，则使用默认值
            }
          } else {
            selectedLabels.push('N/A'); // 如果未选择库位，则使用默认值
          }
        } else {
          selectedLabels.push('N/A', 'N/A'); // 如果未找到对应仓库信息，则使用默认值
        }

        // 添加批次信息
        selectedLabels.push(item.batch || 'N/A');

        // 根据找到的仓库、库位和批次信息构建显示的字符串
        return `${selectedLabels.join('-')}（${item.addNumber}）个`;
      }

      return `N/A（${item.addNumber}）个`; // 如果选择值不符合预期的格式，返回默认值
    });

    return formattedList.join('<br>');
  }

  return '选择入库：位置-批次';
}
</script>

<style scoped>

</style>