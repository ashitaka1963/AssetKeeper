<script setup lang="ts">
import { ref, computed } from 'vue';

window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
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
    borderColor: '#535A6C',
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
  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       options: {
  //         legend: {
  //           position: 'bottom',
  //           offsetX: -10,
  //           offsetY: 0
  //         }
  //       }
  //     }
  //   ],
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
  xaxis: {
    type: 'datetime',
    categories: ['2023/02', '2023/03', '2023/04', '2023/05', '2023/06', '2023/07']
  },
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

const seriesInit: any = [
  {
    name: 'A銀行',
    data: [44, 55, 55, 67, 76, 80]
  },
  {
    name: 'B銀行',
    data: [13, 23, 20, 28, 30, 31]
  },
  {
    name: 'C証券',
    data: [11, 17, 15, 15, 21, 14]
  },
  {
    name: 'その他',
    data: [21, 7, 25, 13, 22, 38]
  }
];
const options = ref(optionsInit);
const series = ref(seriesInit);
</script>

<template>
  <!-- <apexchart width="500" type="bar" :options="options" :series="series"></apexchart> -->
  <apexchart height="250" type="bar" :options="options" :series="series"></apexchart>
</template>

<style scoped>
.container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
}
</style>
