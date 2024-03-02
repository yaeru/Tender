<script setup lang="ts">

	import { ref } from 'vue';

	// Variable para controlar la carga de la API
	const loading = ref(true);

	setTimeout(() => {
		loading.value = false;
	}, 1000);

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


	const isRainExpected = (threshold: number) => {
		const currentHourIndex = hourly.time.findIndex((time: string) => {
			const targetDateTime = new Date(time);
			return targetDateTime.getHours() === new Date().getHours();
		});

		if (typeof document !== 'undefined' && document.body) {
			if (currentHourIndex !== -1) {
				for (let i = currentHourIndex; i < hourly.time.length; i++) {
					const rainProbability = hourly.precipitation_probability[i];
					if (rainProbability >= threshold) {
						document.body.className = 'bgrain'; // Cambia la clase del body a 'bgrain' si se espera lluvia
						return true;
					}
				}
				document.body.className = 'bgsunny';
				return false;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	onMounted(() => {
		// Ejecutar isRainExpected después de que el componente se haya montado para cambiar la clase del body
		isRainExpected(threshold);
	});
</script>

<template>
	<template v-if="!loading">

		<section class="section">
			<template v-if="isRainExpected(threshold)">
				<div class="card card-rain text-center">
					<p class="emoji">
						🌧️
					</p>
					<h2 class="title">
						Entrá el Tender que va a llover.
					</h2>
					<p class="description">La probabilidad de lluvia es mayor a {{threshold}}%</p>
				</div>
			</template>

			<template v-else>
				<div class="card card-sunny text-center">
					<p class="emoji">
						😎
					</p>
					<h2 class="title">
						Aprovechá el solcito.
					</h2>

					<p class="description">La probabilidad de lluvia es menor a {{threshold}}%</p>
				</div>
			</template>
		</section>

		<section id="forecast" class="section text-center">
			<div class="card card-default">
				<h2>Pronóstico</h2>
				<ul>
					<li v-for="(time, index) in hourly.time" :key="index" :style="{ display: isTimePast(time) ? 'none' : 'list-item' }">
						{{ formatTime(time) }} - Chances de que se moje: {{ hourly.precipitation_probability[index] }}%
					</li>
				</ul>
			</div>
		</section>

		<section id="debug" class="section">
			<div>
				<h2>Debug</h2>
				<h2>Hoy es {{ currentDate }} - {{ currentTime }} </h2>
				<ul>
					<li v-for="(time, index) in hourly.time" :key="index" :style="{ color: isTimePast(time) ? 'red' : 'black' }">
						{{ formatDate(time) }} - {{ formatTime(time) }} - Probability: {{ hourly.precipitation_probability[index] }}%
					</li>
				</ul>
			</div>
		</section>
	</template>

	<template v-else>
		<section class="section">
			<h2 class="text-center">Cargando...</h2>
		</section>
	</template>

</template>