<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  series: object;
  xaxis: Array<string>;
}

const props = defineProps<Props>();

const optionsInit: any = {
  chart: {
    type: 'bar',
    stacked: true,
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
    theme: 'dark'
  },
  dataLabels: {
    enabled: false
  },
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
  legend: {
    position: 'top',
    labels: {
      colors: ['#9496a0'],
      useSeriesColors: false
    },
    markers: {
      fillColors: [
        '#c7a780',
        '#E7DFD6',
        '#4A4F5E',
        '#6fd4c3',
        '#c7a780',
        '#E7DFD6',
        '#4A4F5E',
        '#6fd4c3'
      ]
    }
  },
  fill: {
    colors: ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3']
  }
};

const options = computed((): any => {
  const option = optionsInit;
  option.xaxis.categories = props.xaxis;

  // グラフの塗りつぶし（fill-colors)は繰り返しカラー設定されるが、こちらは繰り返されず、既定色が設定されてしまうため、
  // グラフの塗りつぶしカラーと凡例のカラーがずれるため動的に設定する
  const seriesLength = props.series.length;
  if (seriesLength > 1) {
    const originalColors = ['#c7a780', '#E7DFD6', '#4A4F5E', '#6fd4c3'];
    const repeatCount = Math.ceil(seriesLength / originalColors.length);

    const repeatedColors = [];
    for (let i = 0; i < repeatCount; i++) {
      repeatedColors.push(...originalColors);
    }

    console.log(repeatedColors);

    option.legend.markers.fillColors = [...repeatedColors];
  }

  return option;
});
</script>

<template>
  <apexchart height="250" type="bar" :options="options" :series="props.series"></apexchart>
</template>

<style scoped></style>
