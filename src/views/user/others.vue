<template>
  <div class="profile">
    <div v-if="Loadingtop" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div class="profile-header" :style="{backgroundImage:'url(./static/img/main/user_bg' + bgindex + '.svg)'}">
      <!-- <div class="bg-blur"></div> -->

      <el-button class="toAttention"
          :type="Attention==true?'danger':''"
          :icon="Attention==true?'':'el-icon-plus'"
          @click="toAttention()"
          round >{{Attention==true?'已关注':'关注'}}
      </el-button>

      <img class="header-avatar" preview :src="user.Avatar||'./static/img/avatar.jpg'">
      <span class="header-name">{{user.Name}}</span>
      <span class="header-bio">{{Class==null?'':Class+' |'}}  {{user.Name=='ming'?'管理员':(user.Occupation==2?'教师':'学生')}}</span>
      <!-- <div class="header-info">
      </div> -->
    </div>
    <div id="content" class="big-box1200">
      <div>
        <radarChart :customerName="user.Name"></radarChart>
      </div>
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane name="left" disabled></el-tab-pane>
        <el-tab-pane name="info">
          <div slot="label">基本资料</div>

          <baseInfo :user="user" :mClass="Class" :School="School"></baseInfo>

        </el-tab-pane>
        <el-tab-pane name="center" disabled></el-tab-pane>
        <el-tab-pane label="TA的错题" name="ques">
          <div v-show="showLoading" class="loading-box">
            <i class="el-icon-loading"></i>
            加载中...
          </div>
          <div v-show="!questions[0]" class="loading-box">
            <i class="el-icon-search"></i>
            空空如也...
          </div>

          <misList :questions="questions"></misList>

          <div v-show="showMore" class="loading-box">
            <i class="el-icon-loading"></i>
            加载更多中...
          </div>
          <div v-show="questions[0]&&!showMore && NoneMore" class="loading-box">
            <i class="el-icon-search"></i>
            没有更多了...
          </div>
        </el-tab-pane>
        <el-tab-pane name="right" disabled></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import radarChart from '@/components/comps/radarChart.vue'
import misList from '@/views/common/misList'
import baseInfo from './baseInfo'
import {
  P_toFollowee,
  GetCustomer,
  QuesList
} from '@/api/toPost'
import { classList } from '@/assets/js/class.js'
import {
  getSchoolList
} from '@/api/toget'

export default {
  name: 'others',
  components: {
    baseInfo,
    misList,
    radarChart
  },
  data() {
    return {
      Loadingtop: true,
      bgindex: Math.floor(Math.random() * 6),
      showLoading: false,
      showNone: false,
      showMore: false,
      NoneMore: false,
      id: '',
      user: {},
      questions: [],
      Attention: false,
      activeName: 'info',
      classlist: classList,
      Class: '',
      schoolList: [],
      School: '',
      tolist: {
        UserId: 0,
        MistakeCateId: 0,
        Number: 10,
        Page: 1
      }
    }
  },
  activated() {
    this.fetchDate()
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    document.querySelector('.app-main').removeEventListener('scroll', this.onScroll)
    next()
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  methods: {
    getCustomer() {
      GetCustomer(this.$qs.stringify({ UserId: this.id, RequesterId: this.$store.getters.user.Id })).then(res => {
        this.user = res.data.data
        if (!this.user.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        } else {
          var index = this.classlist.find((item) => {
            return item.value === this.user.Class
          })
          this.Class = index.label
          this.Loadingtop = false
          this.Attention = this.user.Focus || false
        }
        this.tolist.UserId = this.user.Id
        this.getschool()
        this.getQues()
      }).catch(() => {})
    },
    getschool() {
      getSchoolList().then(res => {
        this.schoolList = res.data.data
        var index = this.schoolList.find((item) => {
          return item.Id === this.user.SchoolId
        })
        if (index) {
          this.School = index.Name
        } else {
          this.School = '未知'
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    getQues() {
      this.NoneMore = false
      this.showLoading = true
      this.tolist.Page = 1
      QuesList(this.$qs.stringify(this.tolist)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    onScroll() {
      var innerHeight = document.querySelector('.profile').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore) {
          return
        }
        this.showMore = true
        this.tolist.Page++
        QuesList(this.$qs.stringify(this.tolist)).then(res => {
          this.questions = this.questions.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.tolist.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    },
    handleClick(tab) {
      // if (tab.name === 'ques' && !this.questions[0]) {
      //   // console.log(tab.name)
      //   this.getQues()
      // }
    },
    toAttention() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      var data = {
        FolloweeId: this.user.Id,
        UserId: this.$store.getters.user.Id
      }
      P_toFollowee(this.$qs.stringify(data)).then(res => {
        if (res.data.data === -1) {
          this.$notify({
            title: '提示',
            message: '已取消关注',
            type: 'info'
          })
        }
        this.Attention = !this.Attention
        // this.fetchDate()
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        if (this.id === this.$store.getters.user.Id) {
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
          this.$router.push({
            path: '/user/index'
          })
        } else {
          this.getCustomer()
        }
      }
    }
  },
  created() {
    // this.getNotes()
    this.fetchDate()
  }
}
</script>

<style scoped>
 @import '../../styles/consumer.scss';
 .datum-table td{
   padding: 13px 0;
 }
 #content{
   margin-top: 20px;
 }
.profile .icon-collect{
  top: 10px;
  right: 20px;
  font-size: 46px;
}
.bg-blur{
  width: 100%;
  height: 100%;
  background: url("../../assets/images/home/user_bg.jpg") center no-repeat;
  background-size: cover;
  position: absolute;
  z-index: -1;
  filter: blur(8px);
}
.profile-header {
    width: 100%;
    height: 200px;
    /* background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat; */
    display: flex;
    flex-flow: column;
    z-index: 2;
    position: relative;
    transition: 0.28s;
    /* background-size: 8%; */
}

.profile-header .header-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 33px;
    margin-left: 50%;
    transform: translateX(-50%);
    border: 2px solid #fff;
    overflow: hidden;
}

.profile-header .header-info {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: absolute;
    bottom: 0;
    background: linear-gradient( to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100% )
}

.profile-header .header-name {
    color: #ffffff;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
    font-weight: bold;
}

.profile-header .header-bio {
    font-size: 13px;
    color: #ccc;
    margin-top: 5px;
    display: inline-block;
    text-align: center;
}

.info-tab {
    width: 100%;
    height: 50px;
    display: flex;
    flex-flow: row;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #ffffff;
}

.info-tab .info-tag {
    flex: 1;
}
.datum-item-box{
    border-top: 0;
    border-bottom: 1px solid #eeeeee;
}
@media (max-width: 768px)
{
  /* .profile-header{
    height: 240px;
  } */
  /* .profile-header .header-avatar{
    margin-top: 50px;
  } */
}
</style>
