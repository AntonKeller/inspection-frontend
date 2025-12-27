<template>
  <v-btn
      v-bind="$attrs"
      variant="text"
      color="blue-darken-4"
      class="text-body-2"
      rounded="lg"
      prepend-icon="mdi-close"
  />
</template>

<script>
export default {
  name: "my-button-clear",
}
</script>