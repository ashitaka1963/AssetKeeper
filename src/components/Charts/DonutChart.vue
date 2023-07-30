<script setup lang="ts">
import { ref, computed } from 'vue';

// TODO:hover時のTooltip?カラー
// TODO:チャートごとの合計金額表示

// window.Apex = {
//   chart: {
//     foreColor: '#ccc',
//     toolbar: {
//       show: false
//     }
//   },
//   //   stroke: {
//   //     width: 3
//   //   },
//   dataLabels: {
//     enabled: false
//   },
//   tooltip: {
//     theme: 'dark'
//   },
//   grid: {
//     borderColor: '#535A6C',
//     xaxis: {
//       lines: {
//         show: false
//       }
//     },
//     yaxis: {
//       lines: {
//         show: true
//       }
//     }
//   }
// };

const optionsInit: any = {
  chart: {
    type: 'donut'
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ],
  stroke: {
    width: 0
  },
  tooltip: {
    enabled: true,
    theme: 'dark'
  },

  legend: {
    position: 'bottom',
    labels: {
      colors: ['#9496a0'],
      useSeriesColors: false
    },
    markers: {
      fillColors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
    }
    // offsetY: 40
  },

  fill: {
    // opacity: 1,
    colors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
  }
};

const seriesInit: any = [44, 55, 41, 17];
const options = ref(optionsInit);
const series = ref(seriesInit);
</script>

<template>
  <!-- <apexchart width="500" type="bar" :options="options" :series="series"></apexchart> -->
  <apexchart height="250" type="donut" :options="options" :series="series"></apexchart>
</template>

<style scoped>
.container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
}
</style>
