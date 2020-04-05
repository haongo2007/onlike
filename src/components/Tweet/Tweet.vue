<template>
  <div class="event">
    <div class="label">
      <img v-bind:src="tweet.user.avatar">
    </div>
    <div class="content">
      <div class="summary">
        <router-link :to="`/${tweet.user.username}`">
          {{ tweet.user.name }}
          <small>{{ `@${tweet.user.username}` }}</small>
        </router-link>
        <div class="date">
          {{ tweet.created_at | timeAgo }}
          <small v-if="canDeleteTweet">
            <a @click="deleteTweet(tweet.id)">Delete Post</a>
          </small>
        </div>
      </div>
      <div class="extra text" >
        {{ tweet.tweet }}
      </div>

      <TweetReactions
        :tweet="tweet"
        :replies="tweet.replies"
        :favorites.sync="tweet.favorites"
        :auth-user="authUser"
      />
    </div>
  </div>
</template>

<script>
  import TweetReactions from '@/components/Tweet/TweetReactions'
  import EventBus from '@/eventBus'

  export default {
    name: 'Tweet',
    components: {
      TweetReactions
    },
    data () {
      return {
        authUser: this.$store.state.user
      }
    },
    props: {
      tweet: {
        type: Object,
        required: true
      }
    },
    computed: {
      canDeleteTweet () {
        return this.tweet.user_id === this.authUser.id
      }
    },
    methods: {
      deleteTweet (tweetId) {
        const token = localStorage.getItem('tweetr-token')
        const deleteConfirmed = confirm('Are you sure?')

        if (deleteConfirmed) {
          axios
            .delete(`/tweets/destroy/${tweetId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => {
                this.$store.dispatch('removeTweet',tweetId);
            })
        }
      }
    }
  }
</script>
