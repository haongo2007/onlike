<template>
  <div class="ui segment">
    <div class="ui grid container">
      <div class="four wide column">
        <img class="ui tiny avatar image obj-fit" v-bind:src="user.avatar">
      </div>
      <div class="twelve wide column custom-header">
        <div class="ui horizontal relaxed link list">
          <div class="item">
            <div class="content" @click="ChangeContainUserPage('tweets')">
                <div class="header">Tweets</div>
                <p>{{ count(user.tweets) }}</p>

            </div>
          </div>
          <div class="item">
            <div class="content" @click="ChangeContainUserPage('following')">
                <div class="header">Following</div>
                <strong>{{ count(user.following) }}</strong>
            </div>
          </div>
          <div class="item">
            <div class="content" @click="ChangeContainUserPage('followers')">
                <div class="header">Followers</div>
                <strong>{{ count(user.followers) }}</strong>
            </div>
          </div>
          <div class="item" @click="ChangeContainUserPage('favorites')">
            <div class="content">
                <div class="header">Favorites</div>
                <strong>{{ count(user.favorites) }}</strong>
            </div>
          </div>
        </div>
        <div class="ui right floated horizontal list" v-if="isOwner">
          <router-link to="/settings/profile" class="ui button primary">Edit profile</router-link>
        </div>
        <div class="ui right floated horizontal list" v-if="isLoggedIn && !isOwner">
          <button class="ui tiny primary button" v-if="isFollowing" @click="unFollow(user.id)">Unfollow</button>
          <button class="ui tiny primary button" v-else @click="follow(user.id)">Follow</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UserProfileHeader',
    props: {
      user: {
        type: Object,
        required: true,
        default: function () {
          return { 
            tweets: '',
          }
        }
      },
      authUser: {
        type: Object,
        required: true
      }
    },
    data: function(){
      return {

      }
    },
    computed: {
      isOwner () {
        return this.user.id === this.authUser.id
      },
      isLoggedIn () {
        return !!this.authUser
      },
      isFollowing () {
        if (this.authUser.following) {
          for (const following of this.authUser.following) {
            if (following.id === this.user.id) {
              return true
            }
          }
          return false
        }
      }
    },
    methods: {
      follow (userId) {
        const token = localStorage.getItem('tweetr-token')

        axios
          .post(
            '/users/follow',
            { user_id: userId },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            this.authUser.following.push({ id: userId })
          })
      },
      unFollow (userId) {
        const token = localStorage.getItem('tweetr-token')

        axios
          .delete(`/users/unfollow/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.authUser.following = this.authUser.following.filter(u => {
              return u.id !== userId
            })
          })
      },
      count: function(arr){ 
        return arr == undefined ? 0 : arr.length;
      },
      ChangeContainUserPage: function(data) {
          // phát ra sự kiện 'selectedComponentB' với data là 'component-b đã được chọn'
          this.$emit('ChangeContainUserPage', data);
      }
    }
  }
</script>
