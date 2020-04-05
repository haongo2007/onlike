<template>
    <div>
        <sui-comment v-for="reply in replies" :key="reply.id">
            <sui-comment-avatar  v-bind:src="reply.user.avatar" />
            <sui-comment-content>
                <router-link :to="reply.user.username">
                    <a is="sui-comment-author">{{ reply.user.name }}</a>
                    <small>{{ `@${reply.user.username}` }}</small>
                </router-link>
                <sui-comment-metadata>
                    <div>{{ reply.created_at | timeAgo }}</div>
                </sui-comment-metadata>
                <sui-comment-text>
                    {{ reply.reply }}
                </sui-comment-text>
                <sui-comment-actions>
                    <sui-comment-action>Reply</sui-comment-action>
                </sui-comment-actions>
            </sui-comment-content>
        </sui-comment>
    </div>
</template>

<script>
  export default {
    name: 'Replies',
    props: {
      replies: {
        type: Array,
        required: true
      }
    }
  }
</script>
