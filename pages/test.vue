<script setup lang="ts">
	const params = {
		"latitude": -34.9215,
		"longitude": -57.9545,
		"current": ["precipitation"],
		"hourly": ["precipitation_probability"],
		"timezone": "America/Argentina/Buenos_Aires",
		"forecast_days": 1
	};
	const url = "https://api.open-meteo.com/v1/forecast";
	const threshold = 40; // Umbral de probabilidad

  	// Construye la URL con los parámetros
	const fullUrl = `${url}?latitude=${params.latitude}&longitude=${params.longitude}&hourly=${params.hourly.join(',')}&timezone=${params.timezone}&forecast_days=${params.forecast_days}`;

  	// Realiza la solicitud usando useFetch y la URL construida
	const { data: pronostico } = await useFetch(fullUrl);
	const hourly = pronostico.value.hourly;
	const dateTime = hourly.time;


	const formatDate = (dateTime: string) => {
		return dateTime.slice(0, 10);
	};

	const formatTime = (dateTime: string) => {
		// Extraer la parte de la hora (últimos 5 caracteres después de la 'T')
		return dateTime.slice(11);
	};

	// CURRENTS
	// Obtiene la fecha actual en formato de objeto Date
	const currentDate = new Date().toISOString().split('T')[0];

	// Obtiene la hora actual en formato de objeto Date
	//const currentTime = new Date().toTimeString().substring(0, 5);
	const currentTime = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });


	// MATCH CURRENTS
	const isTimePast = (time: string) => {
		const currentDateTime = new Date();
		const targetDateTime = new Date(time);
		// Comparar si la hora de targetDateTime es menor que la hora actual
		return targetDateTime.getHours() < currentDateTime.getHours();
	};


	// FORECAST FUNCTION
	const isRainExpected = (threshold: number) => {
		const currentHourIndex = hourly.time.findIndex((time: string) => {
			const targetDateTime = new Date(time);
			return targetDateTime.getHours() === new Date().getHours();
		});

		if (currentHourIndex !== -1) {
			for (let i = currentHourIndex; i < hourly.time.length; i++) {
				const rainProbability = hourly.precipitation_probability[i];
				if (rainProbability >= threshold) {
					return true;
				}
			}
			return false;
		} else {
			return false;
		}
	};

</script>

<template>

	<h2>Hoy es {{ currentDate }} - {{ currentTime }} </h2>

	<div v-if="isRainExpected(threshold)">
		<h2>
			Entrá el Tender que va a llover.
		</h2>
		<p>La probabilidad de lluvia es mayor a {{threshold}}%</p>
	</div>
	<div v-else>
		Aprovechá el solcito.
		<p>La probabilidad de lluvia es menor a {{threshold}}%</p>
	</div>

	<div>
		<h2>Detalles</h2>
		<ul>
			<li v-for="(time, index) in hourly.time" :key="index" :style="{ display: isTimePast(time) ? 'none' : 'list-item' }">
				{{ formatDate(time) }} - {{ formatTime(time) }} - Probability: {{ hourly.precipitation_probability[index] }}%
			</li>
		</ul>
	</div>
</template>