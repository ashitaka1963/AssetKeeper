<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  series: object;
}

const props = defineProps<Props>();

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
    type: 'category'
    // type: 'numeric'
    // type: 'datetime',
    // labels: {
    //   format: 'yyyy/MM'
    // }

    // categories: ['2023/02', '2023/03', '2023/04', '2023/05', '2023/06', '2023/07']
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

const options = ref(optionsInit);
</script>

<template>
  <apexchart height="250" type="line" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
