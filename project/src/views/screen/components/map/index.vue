<template>
    <div class="box4" ref="map"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from 'echarts';
import chinaJson from './map.json';
let map=ref();
//注册中国地图
echarts.registerMap('china',(chinaJson as any));
onMounted(()=>{
    let mychart=echarts.init(map.value);
    mychart.setOption({
        //地图组件
        geo:{
            map:'china',
            roam:true,//鼠标缩放
            left:150,
            top:100,
            //地图上的文字显示
            label:{
                show:true,
                fontSize:16
                // rotate:20旋转
            },
            itemStyle: {
                //每一个多边形的样式
                color: {
                    //线性渐变参数
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'green' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'white' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                opacity: .8
            },
            //地图高亮的效果
            emphasis: {
                itemStyle: {
                    color: 'white'
                },
                label: {
                    fontSize: 40
                }
            }
        },
        //布局位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        series: [
            {
                type: 'lines',//航线的系列
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [119.306239, 26.075302]   // 终点

                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        }
                    },
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [114.298572,30.584355]   // 终点

                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'yellow',
                            width: 5
                        }
                    }
                ],
                //开启动画特效
                effect: {
                    show: true,
                    symbol: 'arrow',
                    color: 'black',
                    symbolSize: 10
                }
            }
        ]
        })
    })

</script>
<style scoped lang="scss">

</style>