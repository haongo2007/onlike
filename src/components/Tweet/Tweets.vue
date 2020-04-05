<template>
    <div class="ui feed">
      <Tweet
        v-for="tweet in tweets"
        :key="tweet.id"
        :tweet="tweet"
      />
    </div>
</template>

<script>
  import Tweet from '@/components/Tweet/Tweet'
  

  export default {
    name: 'Tweets',
    components: {
      Tweet
    },
    props: {
      tweets: {
        required: true
      },
    },
    methods: {
      fetchAddedTweet (tweet) {
        // add tweet to top of tweets
        return this.$store.state.tweets.unshift(tweet)
      },
      fetchTweet (){

      }
    }
  }
</script>
