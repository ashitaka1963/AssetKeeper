<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  series: object;
  labels: object;
}

const props = defineProps<Props>();

const optionsInit: any = {
  chart: {
    type: 'donut',
    foreColor: '#ccc'
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
  dataLabels: {
    enabled: false
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            color: '#7c808e'
          }
        }
      }
    }
  },
  colors: '#7c808e', // tooltip背景色
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
  },
  fill: {
    colors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
  }
};

const options = computed((): any => {
  const option = optionsInit;
  option.labels = props.labels;

  return option;
});
</script>

<template>
  <apexchart height="250" type="donut" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
