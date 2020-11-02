import Vue from 'vue'
import Router from 'vue-router'
import SignUpForm from '@/page/Auth/SignUpForm'
import LogInForm from '@/page/Auth/LogInForm'
import UserProfileSettings from '@/components/User/Settings/UserProfileSettings'
import UserPasswordSettings from '@/components/User/Settings/UserPasswordSettings'
import Home from '@/page/tweetr/index'
import SingleTweet from '@/components/Tweet/SingleTweet'
import UserProfile from '@/page/User/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/signup',
      component: SignUpForm
    },
    {
      path: '/login',
      component: LogInForm
    },
    {
      path: '/settings/profile',
      component: UserProfileSettings
    },
    {
      path: '/settings/password',
      component: UserPasswordSettings
    },
    {
      path: '/:username',
      component: UserProfile,
      props: true
    },
    {
      path: '/:username/status/:id',
      component: SingleTweet,
      props: true
    }
  ]
})
