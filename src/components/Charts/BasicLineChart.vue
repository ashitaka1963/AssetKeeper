<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  series: object;
}

const props = defineProps<Props>();

const optionsInit: any = {
  chart: {
    type: 'line',
    foreColor: '#9496a0',
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
  tooltip: {
    enabled: true,
    theme: 'dark'
  },
  colors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3'],
  stroke: {
    curve: 'straight',
    width: 3
  },

  grid: {
    show: true,
    borderColor: '#4c515f',
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    type: 'category',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },

  markers: {
    size: 4,
    colors: '#30343d',
    strokeColors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
  }
};

const options = ref(optionsInit);
</script>

<template>
  <apexchart height="250" type="line" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
