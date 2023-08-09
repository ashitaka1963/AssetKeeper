<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  series: object;
  labels: object;
}

const props = defineProps<Props>();

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
  // dataLabels: {
  //   enabled: true,
  //   formatter: function (val) {
  //     return val + '%';
  //   }
  // },
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
  colors: '#7c808e',
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

const options = computed((): any => {
  const option = optionsInit;
  option.labels = props.labels;

  return option;
});
</script>

<template>
  <!-- <apexchart width="500" type="bar" :options="options" :series="series"></apexchart> -->
  <apexchart height="250" type="donut" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
