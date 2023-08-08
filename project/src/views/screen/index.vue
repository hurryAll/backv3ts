<template>
    <div class="container">
        <!-- 数据大屏展示内容区域 -->
        <div class="screen" ref="screen">
            <div class="top">
                <top></top>
            </div>
            <div class="bottom">
                <div class="left">
                    <Tourist class="tourist"></Tourist>
                    <Sex class="sex"></Sex>
                    <Age class="age"></Age>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <Line class="line"></Line>
                </div>
                <div class="right">
                    <Rank class="rank"></Rank>
                    <Year class="year"></Year>
                    <Count class="count"></Count>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Tourist from './components/tourist/index.vue';
import Age from './components/age/index.vue';
import Sex from './components/sex/index.vue';
import Map from './components/map/index.vue';
import Line from './components/line/index.vue';
import Year from './components/year/index.vue';
import Rank from './components/rank/index.vue';
import Count from './components/count/index.vue';
import top from './components/top/index.vue';
import { ref, onMounted } from 'vue';
//数据大屏展示内容盒子的Dom元素
let screen = ref<any>();
onMounted(() => {
    //scale默认在中心缩放  translate中负数就是向左/上  正数就是向右/下旋转,缩放完毕后旋转回来
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
const getScale = (w = 1920, h = 1080) => {
    let ww = window.innerWidth / w;
    let hh = window.innerHeight / h;
    return ww < hh ? ww : hh;
}
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>
<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;

    .screen {
        position: fixed;
        width: 1920px;
        height: 1080px;
        left: 50%;
        top: 50%;
        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .bottom {
            display: flex;

            .left {
                flex: 1;
                height: 1040px;
                display: flex;
                flex-direction: column;

                .tourist {
                    flex: 1;
                    // background-color: aquamarine;
                }

                .sex {
                    flex: 1;
                }

                .age {
                    flex: 1.2;
                }
            }

            .center {
                flex: 2;
                display: flex;
                flex-direction: column;

                .map {
                    flex: 4;
                }

                .line {
                    flex: 1;
                }
            }

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                .rank{
                    flex:1.5;
                }
                .year{
                    flex:1;
                }
                .count{
                    flex:1;
                }
            }
        }
    }
}</style>