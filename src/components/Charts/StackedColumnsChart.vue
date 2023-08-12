<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, computed } from 'vue';

interface Props {
  series: object;
  xaxis: Array<string>;
}

const props = defineProps<Props>();

// TODO:見直し
window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  //   stroke: {
  //     width: 3
  //   },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark'
  },
  grid: {
    borderColor: '#9496a0',
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
  }
};

const optionsInit: any = {
  chart: {
    type: 'bar',
    stacked: true
    // toolbar: {
    //   show: false
    // }
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
  plotOptions: {
    bar: {
      horizontal: false
      //   borderRadius: 10,
      //   dataLabels: {
      //     total: {
      //       enabled: true,
      //       style: {
      //         fontSize: '13px',
      //         fontWeight: 900
      //       }
      //     }
      //   }
    }
  },
  // xaxis: {
  //   // type: 'category'
  //   // type: 'datetime',
  //   // categories: ['2023/02', '2023/03', '2023/04', '2023/05', '2023/06', '2023/07']
  // },
  legend: {
    position: 'top',
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
  option.xaxis = { categories: props.xaxis };

  return option;
});
</script>

<template>
  <apexchart height="250" type="bar" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
