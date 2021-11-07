const days = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
]

const options = {
	q: 'cabuyao',
	units: 'metric',
}

getWeather(options)
	.then(weather =>
	{
		displayCurrDayInfo(weather.location.city, weather.forecast[0]);

		const forecastContainer = document.querySelector('.forecast-container');
		const forecastCardElems = weather.forecast.map(day => createForecastCard(day))
		forecastContainer.append(...forecastCardElems);
	});

const displayCurrDayInfo = (() =>
{
	const currentDaySection = document.querySelector('.currentDay');
	const cityDisplay = currentDaySection.querySelector('.cityDisplay');
	const tempDisplay = currentDaySection.querySelector('.tempDisplay');
	const humidityDisplay = currentDaySection.querySelector('.humidityDisplay');
	const conditionDisplay = currentDaySection.querySelector('.conditionDisplay');
	const windSpeedDisplay = currentDaySection.querySelector('.windSpeedDisplay');

	return (location, forecastObj) =>
	{
		cityDisplay.textContent = location;
		tempDisplay.textContent = `${forecastObj.temp.avg}°C`;
		humidityDisplay.textContent = `${forecastObj.humidity}%`;
		// No way to get condtion type right now
		// conditionDisplay.textContent = forecastObj.;
		windSpeedDisplay.textContent = `${forecastObj.wind.speed}m/s`;
	}
})()

const createForecastCard = (forecastObj) =>
{
	const dayDisplay = component('span', {
		props: {
			class: [
				'day',
			]
		},
		children: [
			days[forecastObj.date.getDay()],
		]
	})

	const conditionImg = component('img', {
		props: {
			// Hardcode to this img for now
			src: 'http://openweathermap.org/img/wn/02d@2x.png'
		}
	})

	const tempDisplay = component('span', {
		children: [
			`${forecastObj.temp.avg}°C`
		]
	})

	const forecastCard = component('div', {
		props: {
			class: [ 'forecast-card' ]
		},
		children: [
			dayDisplay,
			conditionImg,
			tempDisplay,
		]
	})

	return forecastCard;
}