<script setup lang="ts">
import { computed } from 'vue';
interface Props {
  isDialogVisible: boolean;
  message: string;
}

interface Emits {
  (event: 'clickConfirmed'): void;
  (event: 'clickCanceled'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const isDialogVisible = computed((): boolean => {
  return props.isDialogVisible;
});

const onConfirmedButtonClick = (): void => {
  emit('clickConfirmed');
};

const onCancelButtonClick = (): void => {
  emit('clickCanceled');
};
</script>

<template>
  <el-dialog
    v-model="isDialogVisible"
    title="Warning"
    width="30%"
    align-center
    :before-close="onCancelButtonClick"
  >
    <span>{{ props.message }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="onCancelButtonClick">Cancel</el-button>
        <el-button color="#c7a780" @click="onConfirmedButtonClick"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
