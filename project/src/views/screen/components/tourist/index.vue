<template>
    <div class="box">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="right">可预约总量<span>9999</span>人</p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">
                {{ item }}
            </span>
        </div>
        <div class="charts" ref="charts">123</div>
    </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import 'echarts-liquidfill';
import { ref, onMounted } from 'vue';
let people = ref('215793人');
let charts = ref();
onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value);
    //设置实例的配置项
    mycharts.setOption({
        title: {
            text: '水球体'
        },
        //x|y轴组件
        xAxis: {},
        yAxis: {},
        //系列：决定展示什么样的图形图标
        //type:pie饼图  bar柱图 line折线图 liquidFill水球图
        series: [{
            type: 'liquidFill',
            data: [0.6, 0.4, 0.2],
            waveAnimation: true,//动画
            animationDuration: 3,//动画每次时间
            animationDurationUpdate: 0,
            radius: '80%',
            outline: {
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'white',
                    borderColor: '#29fcff',
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },

            backgroundStyle: {
                color: 'white'
            },
        }],
        //布局组件
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    })
})

</script>
<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;

    .top {
        margin-left: 10px;

        .title {
            margin-top:10px;
            color: white;
            font-size: 25px;
        }

        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat;
            background-size: 100% 100%;
            margin-top: 10px;
        }

        .right {
            float: right;
            color: white;
            font-size: 20px;
        }
    }

    .number {
        padding: 20px;
        display: flex;
        margin-top: 20px;

        // padding:10px
        span {
            flex: 1;
            height: 77px;
            text-align: center;
            line-height: 77px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
            font-size: 20px
        }
    }

    .charts {
        margin-top:-10px;
        width: 100%;
        height: 220px;
    }
}
</style>