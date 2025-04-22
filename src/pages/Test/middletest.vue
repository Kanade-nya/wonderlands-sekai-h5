<script setup>
import { useUserData } from '@/stores/useUserData.js'
import { onMounted } from 'vue';

const userData = useUserData()
onMounted(() => {
    userData.setUserData({
        name: '张三',
        age: 18,
        sex: '男',
        userName: 'zhangsan',
    })
    console.log('页面已挂载');
    console.log(userData.getUserData())
});



</script>

<template>

</template>