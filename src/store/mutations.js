
export default {
    setTokenUser(state,token) {
        state.checkLogin = token
    },
    removeTokenUser (state) {
        state.checkLogin = null
    },
    setUser(state, user){
        state.user = user
    },
    setAuthUser(state, user){
        state.authUser = user
    },
    setTweet(state, tweet){
        state.tweets = tweet.reverse()
    },
    removeTweet(state, tweetId) {
        var tweets = state.tweets;
        var result = tweets.filter(tweet => tweetId == tweet.id );
        
        tweets.forEach(function (value,i) {
            if (result[0].id == value.id) {
                tweets.splice(i,1)
            }
        })
        
        var mytweets = state.user.tweets;
        var myresult = mytweets.filter(mytweet => tweetId == mytweet.id );
        mytweets.forEach(function (value,i) {
            if (myresult[0].id == value.id) {
                mytweets.splice(i,1)
            }
        })

        state.user.tweets = mytweets;
        state.tweets = tweets;
    },
    addedTweet(state,data) {
        state.tweets.unshift(data);
    },
    favoriteTweet(state, tweet) {
        state.user.favorites.unshift(tweet);
    },
    unFavoriteTweet(state, tweetId) {
        var myfavoriteTweet = state.user.favorites;
        myfavoriteTweet.forEach(function (value,i) {
            if (tweetId == value.tweet_id) {
                myfavoriteTweet.splice(i,1)
            }
        })
        state.user.favorites = myfavoriteTweet;
    }
}