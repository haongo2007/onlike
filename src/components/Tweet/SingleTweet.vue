<template lang="html">
    <sui-comment-group threaded>
    <sui-button content="Back" icon="left arrow" label-position="left" @click="back" />
    <sui-comment>
        <sui-comment-avatar v-bind:src="tweet.user.avatar" />
        <sui-comment-content>

            <router-link :to="`/${tweet == null ? '' : tweet.user.username }`">
                <a is="sui-comment-author">{{ tweet.user.name }}</a>
                <small>{{ `@${tweet.user.username }` }}</small>
            </router-link>

            <sui-comment-metadata>
              <div>{{ tweet.created_at | timeAgo }}</div>
            </sui-comment-metadata>
            <sui-comment-text>{{ tweet.tweet }}</sui-comment-text>
            <sui-comment-actions>
                <TweetReactions
                  :tweet="tweet"
                  :replies="replies"
                  :favorites.sync="tweet.favorites"
                  :auth-user="authUser"
                />
            </sui-comment-actions>
        </sui-comment-content>
        <sui-comment-group>
            <Replies :replies="replies"/>
        </sui-comment-group>
    </sui-comment>
    <form class="ui form" @submit.prevent="replyTweet">
        <div class="field">
            <textarea  v-model="reply" name="reply" rows="2" placeholder="Reply tweet"></textarea>
        </div>
        <button class="ui blue button" :disabled="!isFormValid">
            <i class="icon edit"></i> Add Reply
        </button>
      </form>
    </sui-comment-group>
</template>

<script>
  import Replies from '@/components/Tweet/Replies'
  import TweetReactions from '@/components/Tweet/TweetReactions'

  export default {
    name: 'SingleTweet',
    components: {
      Replies,
      TweetReactions,
    },
    data () {
      return {
        tweet: {
          user:{
            username:'',
          },
          favorites:[],
        },
        replies: [],
        reply: '',
        authUser: {}
      }
    },
    props: {
      tweetId:''
    },
    computed: {
      isFormValid () {
        return !!this.reply
      }
    },
    mounted () {
      this.fetchTweet()
      this.fetchAuthenticatedUser()
    },
    methods: {
      fetchTweet () {

        axios.get(`/tweets/${this.tweetId}`).then(response => {
          this.tweet = response.data.data
          this.replies = response.data.data.replies.reverse()
        })
      },
      back () {
        this.$bus.$emit('ChangeContainTweetPage', {name:'tweets',id:null});
      },
      replyTweet () {
        const token = localStorage.getItem('tweetr-token')

        axios
          .post(
            `/tweets/reply/${this.tweet.id}`,
            { reply: this.reply },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            this.reply = ''

            this.replies.unshift(response.data.data)
          })
      },
      fetchAuthenticatedUser () {
        const token = localStorage.getItem('tweetr-token')

        axios
          .get('account/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.authUser = response.data.data
          })
      }
    }
  }
</script>
