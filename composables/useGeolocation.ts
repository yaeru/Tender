import { onUnmounted, onMounted, ref } from 'vue'

export const useGeolocation = () => {
	const kordinat = ref({ latitude: 0, longitude: 0 })
	const isSupported = typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator

	let watcher = null
	onMounted(() => {
		if(isSupported)
			watcher = navigator.geolocation.watchPosition(
				position => (kordinat.value = position.coords)
				)
	})

	onUnmounted(()=> {
		if (watcher) navigator.geolocation.clearWatch(watcher)
	})
	return { kordinat, isSupported }
}
