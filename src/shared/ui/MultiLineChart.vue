<template>
  <div :class="$style.chartContainer">
    <svg :class="$style.chart" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
      <!-- Grid lines -->
      <line
        v-for="i in 5"
        :key="`grid-${i}`"
        :x1="0"
        :y1="(height / 4) * (i - 1)"
        :x2="width"
        :y2="(height / 4) * (i - 1)"
        stroke="#E5E7EB"
        stroke-width="1"
      />
      
      <!-- Chart lines for each dataset -->
      <g v-for="(dataset, datasetIndex) in datasets" :key="`dataset-${datasetIndex}`">
        <polyline
          :ref="el => setLineRef(el, datasetIndex)"
          :class="$style.chartLine"
          :points="getLinePoints(dataset.data)"
          fill="none"
          :stroke="dataset.color"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Data points -->
        <circle
          v-for="(point, pointIndex) in getPoints(dataset.data)"
          :key="`point-${datasetIndex}-${pointIndex}`"
          :class="$style.chartPoint"
          :cx="point.x"
          :cy="point.y"
          r="4"
          :fill="dataset.color"
          :style="{ animationDelay: `${pointIndex * 0.05}s` }"
        />
      </g>
    </svg>
    
    <!-- X-axis labels -->
    <div :class="$style.chartLabels">
      <span v-for="(label, index) in labels" :key="`label-${index}`">
        {{ label }}
      </span>
    </div>
    
    <!-- Legend -->
    <div :class="$style.chartLegend">
      <div v-for="(dataset, index) in datasets" :key="`legend-${index}`" :class="$style.legendItem">
        <span :class="$style.legendDot" :style="{ backgroundColor: dataset.color }"></span>
        <span>{{ dataset.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, nextTick } from 'vue';

interface Dataset {
  label: string;
  data: number[];
  color: string;
}

interface Props {
  datasets: Dataset[];
  labels: string[];
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 200,
});

const lineRefs = ref<(SVGPolylineElement | null)[]>([]);

const setLineRef = (el: any, index: number) => {
  if (el) {
    lineRefs.value[index] = el as SVGPolylineElement;
  }
};

// Calculate min and max across all datasets
const minValue = computed(() => {
  const allValues = props.datasets.flatMap(d => d.data);
  return Math.min(...allValues);
});

const maxValue = computed(() => {
  const allValues = props.datasets.flatMap(d => d.data);
  return Math.max(...allValues);
});

const range = computed(() => maxValue.value - minValue.value || 1);

const animateLines = async () => {
  await nextTick();
  lineRefs.value.forEach((lineRef) => {
    if (lineRef) {
      const length = lineRef.getTotalLength();
      
      // Set up the animation
      lineRef.style.strokeDasharray = `${length}`;
      lineRef.style.strokeDashoffset = `${length}`;
      
      // Trigger animation
      requestAnimationFrame(() => {
        if (lineRef) {
          lineRef.style.transition = 'stroke-dashoffset 0.8s ease-out';
          lineRef.style.strokeDashoffset = '0';
          
          // Remove dasharray after animation completes
          setTimeout(() => {
            if (lineRef) {
              lineRef.style.strokeDasharray = 'none';
              lineRef.style.transition = '';
            }
          }, 800);
        }
      });
    }
  });
};

// Watch for data changes to trigger animation
watch(() => props.datasets, () => {
  lineRefs.value = [];
  nextTick(() => {
    animateLines();
  });
}, { deep: true });

onMounted(() => {
  animateLines();
});

const getPoints = (data: number[]) => {
  const segmentWidth = props.width / (data.length - 1 || 1);
  
  return data.map((value, index) => {
    const x = index * segmentWidth;
    const normalizedValue = (value - minValue.value) / range.value;
    const y = props.height - (normalizedValue * props.height * 0.8) - (props.height * 0.1);
    
    return { x, y };
  });
};

const getLinePoints = (data: number[]) => {
  return getPoints(data).map(p => `${p.x},${p.y}`).join(' ');
};
</script>

<style module>
.chartContainer {
  margin-top: 24px;
  position: relative;
}

.chart {
  width: 100%;
  height: 200px;
  margin-bottom: 8px;
}

.chartLine {
  /* Animation is applied via JavaScript */
}

.chartPoint {
  animation: fadeInPoint 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInPoint {
  to {
    opacity: 1;
  }
}

.chartLabels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6B7280;
  padding: 0 4px;
  margin-bottom: 12px;
}

.chartLegend {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #374151;
  flex-wrap: wrap;
}

.legendItem {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legendDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #5fdbd1;
}
</style>
