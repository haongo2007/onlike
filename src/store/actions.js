export default {
    setTokenUser({commit},token) {
        commit('setTokenUser', token)
    },
    removeTokenUser({commit}) {
        commit('removeTokenUser')
    },
    setUser({commit}, user) {
        commit('setUser', user)
    },
    setAuthUser({commit}, user) {
        commit('setAuthUser', user)
    },
    setTweet({commit}, tweet) {
        commit('setTweet', tweet)
    },
    removeTweet({commit}, tweet) {
        commit('removeTweet', tweet)
    },
    addedTweet({commit},data) {
        commit('addedTweet',data)
    },
    favoriteTweet({commit}, tweet) {
        commit('favoriteTweet', tweet)
    },
    unFavoriteTweet({commit}, tweetId) {
        commit('unFavoriteTweet', tweetId)
    }
}