<script setup>
	import { useGeolocation } from './composables/useGeoLocation'

	const {kordinat} = useGeolocation()
	const posisiUser = computed(()=>({
		lat : kordinat.value.latitude,
		lng : kordinat.value.longitude
	}))
</script>

<template>
	<h2>Coords : {{posisiUser.lat}}, {{posisiUser.lng}}</h2>
</template>