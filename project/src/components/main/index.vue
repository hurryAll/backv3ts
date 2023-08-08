<template>
    <!-- 二级路由及过度动画 -->
    <router-view v-slot="{ Component }">
        <transition name="fade">
                <component :is="Component" v-if="flag" />
        </transition>
    </router-view>
</template>
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue';
let store = useLayOutSettingStore();
let flag = ref(true);
watch(() => store.refresh, () => {
    flag.value = false;
    //等待Dom结束之后运行
    nextTick(() => {
        flag.value = true;
    })
})
</script>
<script lang="ts">
export default {
    name: 'Main'
}
</script>
<style scoped lang="scss">
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.fade-enter-active {
    transition: all 1s;
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>