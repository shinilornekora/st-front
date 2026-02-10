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
      
      <!-- Chart line -->
      <polyline
        ref="chartLineRef"
        :class="$style.chartLine"
        :points="linePoints"
        fill="none"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Data points -->
      <circle
        v-for="(point, index) in points"
        :key="`point-${index}-${animationKey}`"
        :class="$style.chartPoint"
        :cx="point.x"
        :cy="point.y"
        r="4"
        :fill="color"
        :style="{ animationDelay: `${index * 0.05}s` }"
      />
    </svg>
    
    <!-- X-axis labels -->
    <div :class="$style.chartLabels">
      <span v-for="(label, index) in labels" :key="`label-${index}`">
        {{ label }}
      </span>
    </div>
    
    <!-- Legend -->
    <div :class="$style.chartLegend">
      <span :class="$style.legendDot" :style="{ backgroundColor: color }"></span>
      <span>{{ legendLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, nextTick } from 'vue';

interface Props {
  data: number[];
  labels: string[];
  legendLabel?: string;
  color?: string;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  legendLabel: 'Stivalli',
  color: '#5fdbd1',
  width: 600,
  height: 200,
});

const chartLineRef = ref<SVGPolylineElement | null>(null);
const animationKey = ref(0);

const minValue = computed(() => Math.min(...props.data));
const maxValue = computed(() => Math.max(...props.data));
const range = computed(() => maxValue.value - minValue.value || 1);

const animateLine = async () => {
  await nextTick();
  if (chartLineRef.value) {
    const length = chartLineRef.value.getTotalLength();
    
    // Set up the animation
    chartLineRef.value.style.strokeDasharray = `${length}`;
    chartLineRef.value.style.strokeDashoffset = `${length}`;
    
    // Trigger animation
    requestAnimationFrame(() => {
      if (chartLineRef.value) {
        chartLineRef.value.style.transition = 'stroke-dashoffset 0.8s ease-out';
        chartLineRef.value.style.strokeDashoffset = '0';
        
        // Remove dasharray after animation completes to show solid line
        setTimeout(() => {
          if (chartLineRef.value) {
            chartLineRef.value.style.strokeDasharray = 'none';
            chartLineRef.value.style.transition = '';
          }
        }, 800);
      }
    });
  }
};

// Watch for data changes to trigger animation
watch(() => props.data, () => {
  animationKey.value++;
  animateLine();
}, { deep: true });

onMounted(() => {
  animateLine();
});

const points = computed(() => {
  const segmentWidth = props.width / (props.data.length - 1 || 1);
  
  return props.data.map((value, index) => {
    const x = index * segmentWidth;
    const normalizedValue = (value - minValue.value) / range.value;
    const y = props.height - (normalizedValue * props.height * 0.8) - (props.height * 0.1);
    
    return { x, y };
  });
});

const linePoints = computed(() => {
  return points.value.map(p => `${p.x},${p.y}`).join(' ');
});
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
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.legendDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #5fdbd1;
}
</style>
