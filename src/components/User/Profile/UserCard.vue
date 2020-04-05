<template>  
    <div class="column">
      <div class="ui card">
        <div class="content">
          <img class="right floated mini ui image" v-bind:src="user.avatar">
          <div class="header">
            <router-link :to="`/${user.username}`">{{ user.name }}</router-link>
          </div>
          <div class="meta">
            {{ `@${user.username}` }}
          </div>
          <div class="description">
            {{ user.bio }}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
