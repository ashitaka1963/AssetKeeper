<script setup lang="ts">
import { ref, computed } from 'vue';

const optionsInit: any = {
  chart: {
    type: 'line',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
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
  colors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3'],
  stroke: {
    curve: 'straight',
    width: 3
  },
  tooltip: {
    enabled: true,
    theme: 'dark'
  },
  grid: {
    show: true,
    borderColor: '#4c515f'
  },
  xaxis: {
    type: 'datetime',
    categories: ['2023/02', '2023/03', '2023/04', '2023/05', '2023/06', '2023/07']
  },
  markers: {
    size: 4,
    colors: '#30343d',
    strokeColors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
  }

  // legend: {
  //   position: 'top',
  //   labels: {
  //     colors: ['#9496a0'],
  //     useSeriesColors: false
  //   },
  //   markers: {
  //     fillColors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
  //   }
  // // offsetY: 40
  // },

  //
};

const seriesInit: any = [
  {
    name: 'A銀行',
    data: [44, 55, 55, 67, 76, 80]
  }
];
const options = ref(optionsInit);
const series = ref(seriesInit);
</script>

<template>
  <!-- <apexchart width="500" type="bar" :options="options" :series="series"></apexchart> -->
  <apexchart height="250" type="line" :options="options" :series="series"></apexchart>
</template>

<style scoped>
.container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
}
</style>
