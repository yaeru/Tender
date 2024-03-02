<script setup>
	import { useGeolocation } from "@/composables/useGeoLocation";

	const {kordinat} = useGeolocation()
	const posisiUser = computed(()=>({
		lat : kordinat.value.latitude,
		lng : kordinat.value.longitude
	}))
	watchEffect(() => {
		console.log({ p: posisiUser.value });
	})
</script>

<template>
	<h2>Coords : {{posisiUser.lat}}, {{posisiUser.lng}}</h2>
</template>