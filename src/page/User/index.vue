<template>
  <div>
    <UserProfileHeader
    :user="user"
    :auth-user="authUser" 
    @ChangeContainUserPage="handleEvent"
    />
    <div class="ui stackable grid container">
      <div class="four wide column">
        <UserProfileSidebarDetails :user="user"/>
      </div>
      <div class="eight wide column">
        <div class="ui segment">
          <Tweets v-if="currentComponent == 'tweets' || currentComponent == 'favorites'" 
          :tweets.sync="currentComponent == 'tweets' ? tweets : MyFavoriteTweet "
          :auth-user="authUser" />

          <UserCard 
          v-else
          v-for="item in user[currentComponent]"
          :key="item.id"
          :user="item"
          />
          
        </div>

      </div>
      <div class="four wide column">
        <WhoToFollow v-if="isLoggedIn"/>
      </div>
    </div>
  </div>
</template>

<script>
  import UserProfileHeader from '@/components/User/Profile/UserProfileHeader'
  import UserProfileSidebarDetails from '@/components/User/Profile/UserProfileSidebarDetails'
  import WhoToFollow from '@/components/User/WhoToFollow'
  import Tweets from '@/components/Tweet/Tweets'
  import UserCard from '@/components/User/Profile/UserCard'

  export default {
    name: 'UserProfile',
    components: {
      UserProfileSidebarDetails,
      UserProfileHeader,
      WhoToFollow,
      Tweets,
      UserCard
    },
    data () {
      return {
        currentComponent: 'tweets',
        user: {},
        tweets: {},
        authUser: {}
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.fetchUser(to.params.username)
      next()
    },
    mounted() {
      this.fetchUser(this.$route.params.username)

      const token = localStorage.getItem('tweetr-token')

      if (token) {
        this.fetchAuthenticatedUser(token)
      }
    },
    computed: {
      isLoggedIn () {
        return !!this.authUser
      },
      MyFavoriteTweet () {
        return Array.from(this.user.favorites, favorite => favorite.tweet).reverse()
      }
    },
    methods: {
      fetchUser (username) {
        axios.get(`/${username}`).then(response => {
          this.user = response.data.data;
          this.tweets = this.user.tweets;
          this.$store.dispatch('setUser',response.data.data); 
        })
      },
      fetchAuthenticatedUser (token) {
        axios
        .get('account/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.authUser = response.data.data;
          this.$store.dispatch('setAuthUser',response.data.data); 
        })
      },
      handleEvent: function(data) {
          // in ra data từ component-b gửi lên
          this.currentComponent = data;
      }
    }
  }
  </script>
