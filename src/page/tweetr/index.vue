<template>
  <div class="ui stackable grid vertically padded container">
    <div class="four wide column">
      <UserSidebar/>
    </div>
    <div class="eight wide column">
      <div class="ui segment">
        <h2 class="ui medium dividing header">Timeline</h2>

        <Tweets
          v-if="currentComponent == 'tweets'"
          :tweets.sync="this.fetchTweet()"
          @ChangeContainTweetPage="handleEvent"
        />

        <SingleTweet
          v-else
          :tweetId="WatchingTweet"
        />

      </div>
    </div>
    <div class="four wide column">
      <WhoToFollow/>
    </div>
  </div>
</template>

<script>
  import UserSidebar from '@/components/User/UserSidebar'
  import Tweets from '@/components/Tweet/Tweets'
  import WhoToFollow from '@/components/User/WhoToFollow'
  import SingleTweet from '@/components/Tweet/SingleTweet'
  import EventBus from '@/eventBus'

  export default {
    name: 'Home',
    components: {
      UserSidebar,
      Tweets,
      WhoToFollow,
      SingleTweet
    },
    data () {
      return {
        currentComponent: 'tweets',
        WatchingTweet: null,
      }
    },
    beforeRouteEnter (to, from, next) {
      const token = localStorage.getItem('tweetr-token')

      return token ? next() : next('/login')
    },
    created() {
      this.$bus.$on('ChangeContainTweetPage',this.handleEvent)
    },
    mounted() {
      this.fetchAuthenticatedUser()
      this.fetchUserTimeline()
    },
    methods: {
      fetchAuthenticatedUser () {
        const token = localStorage.getItem('tweetr-token')
        axios
          .get('/account/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.$store.dispatch('setAuthUser',response.data.data); 
          })
      },
      fetchUserTimeline () {
        const token = localStorage.getItem('tweetr-token')
        axios
          .get('/users/timeline', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.$store.dispatch('setTweet',response.data.data);
          })
      },
      fetchTweet () {
          return this.$store.state.tweets
      },
      handleEvent: function(data) {
          this.currentComponent = data.name;
          this.WatchingTweet = data.id;
      }
    }
  }
</script>
