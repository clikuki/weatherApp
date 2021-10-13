const options = {
	q: 'cabuyao',
	units: 'metric',
}

// °
getWeather(options).then(weather =>
	{
		cityDisplay.textContent = weather.location.city;
		tempDisplay.textContent = `Temperature: ${weather.forecast[0].temp.avg}°${weather.unit}`;
	});

const cityDisplay = document.querySelector('.location');
const tempDisplay = document.querySelector('.temp');
