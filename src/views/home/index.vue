<template>
  <div class="home-container">
    <div class="big-box1200">
      <router-link to="/home/search" class="disNone" >
        <el-button
          class="top-btn_search"
          round
          icon="el-icon-search">搜索</el-button>
      </router-link>
      <div class="top-camera toShow">
        <!-- <router-link to="/todo/addMistake"> -->
        <router-link to="/SQu/index">
          <div class="icon-wrap">
            <div class="light"></div>
            <div class="icon-wp">
              <!-- <svg-icon class-name='icon-camera' icon-class="add" />
              <b>错题添加</b> -->
              <svg-icon
                class-name='icon-camera'
                style="color:rgba(84, 93, 206,0.9)"
                icon-class="camera3"
              />
              <p>拍照搜题</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="home-box">
        <div class="home-top">
          <div class="home_item disNone">
            <router-link to="/SQu/index">
              <svg-icon
                class-name='more_icon'
                style="color:#F56C6C"
                icon-class="camera3"
              />
              <p>拍照搜题</p>
            </router-link>
          </div>
          <div v-if="user.roles&&user.roles.toString()==['teacher']" class="home_item">
            <router-link to="/carveup/addQues">
              <svg-icon
                class-name='more_icon'
                style="color:rgba(84, 93, 206,0.9)"
                icon-class="add"
              />
              <p>添加题目</p>
            </router-link>
          </div>
          <div v-if="!user.roles||(user.roles&&user.roles.toString()!=['teacher'])" class="home_item">
            <!-- <router-link to="/SQu/index"> -->
            <router-link to="/todo/addMistake">
              <!-- <svg-icon class-name='more_icon' style="color:rgba(84, 93, 206,0.9)" icon-class="camera3" />
                <p>拍照搜题</p> -->
              <svg-icon
                class-name='more_icon'
                style="color:rgba(84, 93, 206,0.9)"
                icon-class="add"
              />
              <p>添加错题</p>
            </router-link>
          </div>
          <div v-if="user.roles&&user.roles.toString()==['teacher']" class="home_item">
            <router-link to="/carveup/index">
              <svg-icon
                class-name='more_icon'
                style="color:#409EFF"
                icon-class="form"
              />
              <p>添加测试</p>
            </router-link>
          </div>
          <div v-if="!user.roles||(user.roles&&user.roles.toString()!=['teacher'])" class="home_item">
            <router-link to="/todo/edit">
              <svg-icon
                class-name='more_icon'
                style="color:#409EFF"
                icon-class="form"
              />
              <p>添加笔记</p>
            </router-link>
          </div>
          <div class="home_item">
            <router-link to="/class/index">
              <svg-icon
                class-name='more_icon'
                style="color:#52bab5"
                icon-class="peoples"
              />
              <p>我的班课</p>
            </router-link>
          </div>
          <div class="home_item">
            <!-- <div @click="toQidai"> -->
            <router-link to="/getTest/index">
              <svg-icon
                class-name='more_icon'
                style="color:#fdb75b"
                icon-class="shijuan"
              />
              <p>下载试卷</p>
            </router-link>
          </div>
        </div>
      </div>
      <div>
        <div
          v-show="!showLoading && !questions[0]"
          class="loading-box"
        >
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <div v-show="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <empty v-if="!notes[0]&&!questions[0]"></empty>
        <h4
          class="home-h4"
          v-if="notes[0]"
        ><i class="el-icon-star-off"></i> 最近笔记 <i class="el-icon-star-off"></i></h4>
        <note-box :option="notes"></note-box>
        <h4
          class="home-h4"
          v-show="questions[0]"
        ><i class="el-icon-star-off"></i> 推荐题目 <i class="el-icon-star-off"></i></h4>
        <quex-box :option="questions"></quex-box>
      </div>
    </div>
  </div>
</template>


<script>
import {
  getRecommend
} from '@/api/toget'
import quexBox from '@/components/my-box/quex-box'
import noteBox from '@/components/my-box/note-box'
import empty from '@/components/my-box/empty'
export default {
  name: 'home',
  components: {
    quexBox,
    noteBox,
    empty
  },
  data() {
    return {
      user: this.$store.getters.user,
      homeTop: 0,
      // screenWidth: document.body.clientWidth,
      questions: [],
      notes: [],
      myques: [],
      type: '',
      showLoading: false
    }
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    // console.log(this.homeTop)
    // this.getNotes()
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    next()
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.getNotes()
  //   })
  // },
  methods: {
    // loadmore() {
    //   console.log('11')
    //   this.getNotes()
    // },
    async getNotes() {
      if (this.$store.getters.user.Id) {
        this.showLoading = true
        if (this.$store.getters.recommend.time) {
          this.questions = this.$store.getters.recommend.Questions
          this.notes = this.$store.getters.recommend.Notes
          this.showLoading = false
        } else {
          getRecommend(this.$store.getters.user.Id).then(res => {
            this.questions = res.data.data.Questions
            this.notes = res.data.data.Notes
            this.$store.dispatch('setRecommend', res.data.data)
            this.showLoading = false
          }).catch(() => {
            console.log('获取数据失败！')
            this.showLoading = false
          })
        }
        // console.log(this.$store.getters.recommend)
      } else {
        this.showLoading = true
        getRecommend().then(res => {
          this.questions = res.data.data
          this.showLoading = false
        }).catch(() => {
          console.log('获取数据失败！')
          this.showLoading = false
        })
      }
    },
    toQidai() {
      this.$alert('敬请期待...', '生成练习', {
        confirmButtonText: '确定'
      })
    }
    // handleScroll(e) {
    //   var scrollTop = e.target.scrollTop
    //   var windowHeight = e.target.clientHeight
    //   var scrollHeight = e.target.scrollHeight
    //   if (scrollTop > windowHeight && scrollTop + windowHeight === scrollHeight) {
    //     console.log(scrollTop, windowHeight, scrollHeight)
    //     this.loadmore()
    //   }
    // }
  },
  mounted() {
    // window.addEventListener('resize', () => {
    //   return (() => {
    //     this.screenWidth = document.body.clientWidth
    //   })()
    // })
  },
  created() {
    this.getNotes()
  },
  deactivated() {
    // console.log('deactivated')
  }
}
</script>


