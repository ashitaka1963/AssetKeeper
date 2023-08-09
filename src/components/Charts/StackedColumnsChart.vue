<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, computed } from 'vue';

interface Props {
  series: object;
}

const props = defineProps<Props>();

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

const year = 2023; //TODO:2023年固定
const xaxis: any = [];
for (let month = 1; month <= 12; month++) {
  const monthString = month.toString().padStart(2, '0');
  const date = dayjs(`${year}-${monthString}-01`);
  xaxis.push(date.format('YYYY/MM'));
}

optionsInit.xaxis = { categories: xaxis };
const options = ref(optionsInit);
</script>

<template>
  <!-- <apexchart width="500" type="bar" :options="options" :series="series"></apexchart> -->
  <apexchart height="250" type="bar" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
