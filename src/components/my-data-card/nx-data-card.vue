<template>
  <div class="data-card">
    <el-row :span="24">
      <el-col :span="span" :xs="12" :sm="12" :md="8" :lg="6" v-for="(item,index) in data" :key="index">
        <div class="item" :style="{backgroundColor:item.color}">
          <img :src="item.src" class="item-img" />
          <div class="item-text" :style="{color:colorText,backgroundColor:bgText}">
            <h2>{{item.name}}</h2>
            <p>{{item.text}}</p>
            <div>
               <span style="color:red;font-size:20px;font-weight: 600;float:right;margin-top:20px;margin-right:10px;">￥：{{item.price}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'data-card',
  data() {
    return {
      span: this.option.span || 6,
      data: this.option.data || [],
      colorText: this.option.colorText || '#fff',
      bgText: this.option.bgText || '#2e323f',
      borderColor: this.option.borderColor || '#2e323f'
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
 .item{
   background: rgba(84, 93, 206,0.9);
 }
</style>
