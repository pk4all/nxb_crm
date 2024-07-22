<template>
    <ul class="pagination pagination-spaced">
      <li class="page-item">
          <button class="page-link rounded-pill px-0" :disabled="currentPage == 1" @click="changePage(currentPage - 1)">←</button>
      </li>
      <li :class="page === currentPage?'active page-item ':'page-item '" v-for="page in totalPages"
      :key="page">
        <button class="page-link rounded-pill" @click="changePage(page)">{{ page }}</button>
      </li>
      <li class="page-item">
        <button class="page-link rounded-pill px-0" :disabled="currentPage == totalPages" @click="changePage(currentPage + 1)">→</button>
      </li>
    </ul>
  </template>
  <script>
  export default {
    props: {
      totalItems: {
        type: Number,
        required: true,
      },
      itemsPerPage: {
        type: Number,
        default: 10,
      },
      modelValue: {
        type: Number,
        default: 1,
      },
    },
    computed: {
      totalPages() {
        return this.totalItems;
      },
      currentPage() {
        return this.modelValue;
      },
    },
    methods: {
      changePage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.$emit('update:modelValue', page);
      },
    },
  };
  </script>
  