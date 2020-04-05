<template>
  <div class="ui message" :class="type">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
};
</script>
