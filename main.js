let currentWeather = null;

const displayCurrDayInfo = (() =>
{
	const currentDaySection = document.querySelector('.currentDay');
	const cityDisplay = currentDaySection.querySelector('.cityDisplay');
	const tempDisplay = currentDaySection.querySelector('.tempDisplay');
	const humidityDisplay = currentDaySection.querySelector('.humidityDisplay');
	const conditionDisplay = currentDaySection.querySelector('.conditionDisplay');
	const windSpeedDisplay = currentDaySection.querySelector('.windSpeedDisplay');

	return (location, unit, forecastObj) =>
	{
		cityDisplay.textContent = location;
		tempDisplay.textContent = `${forecastObj.temp.avg}°${unit}`;
		humidityDisplay.textContent = `${forecastObj.humidity}%`;
		conditionDisplay.textContent = forecastObj.weather[0].description;
		windSpeedDisplay.textContent = `${forecastObj.wind.speed}m/s`;
	}
})()

const createForecastCard = (() =>
{
	const daysMap = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday',
	]

	return (unit, forecastObj) =>
	{
		const dayDisplay = component('span', {
			props: {
				class: 'day',
			},
			children: [
				daysMap[forecastObj.date.getDay()],
			]
		})
	
		const conditionImg = component('img', {
			props: {
				src: `http://openweathermap.org/img/wn/${forecastObj.weather[0].icon}@2x.png`,
				class: 'condition',
			}
		})
	
		const tempDisplay = component('span', {
			children: [
				`${forecastObj.temp.avg}°${unit}`
			]
		})
	
		const forecastCard = component('div', {
			props: {
				class: 'forecast-card',
			},
			children: [
				dayDisplay,
				conditionImg,
				tempDisplay,
			]
		})
	
		return forecastCard;
	}
})()

const clearChildren = (elem) =>
{
	const children = elem.children;
	while(children[0])
	{
		const lastElem = children[children.length - 1];
		lastElem.remove()
	}
}

const displayWeatherInfo = weather =>
{
	displayCurrDayInfo(weather.location.city, weather.unit, weather.forecast[0]);

	const forecastContainer = document.querySelector('.forecast-container');
	const forecastCardElems = weather.forecast.map(day => createForecastCard(weather.unit, day))
	clearChildren(forecastContainer);
	forecastContainer.append(...forecastCardElems);
};

const temperature = (() =>
{
	const tempUnits = [
		{
			system: 'metric',
			letter: 'C',
			converter: (temp) => (temp - 32) * 5/9,
		},
		{
			system: 'imperial',
			letter: 'F',
			converter: (temp) => (temp * 9/5) + 32,
		},
	]

	let curUnitIndex = 0;

	return {
		toggle: () => {
			if(tempUnits.length <= 1) return;
			if(++curUnitIndex >= tempUnits.length) curUnitIndex = 0;
			if(currentWeather)
			{
				currentWeather.unit = tempUnits[curUnitIndex].letter;
				for(let i = 0; i < currentWeather.forecast.length; i++)
				{
					const weather = currentWeather.forecast[i];
					const tempObj = weather.temp;

					for(const key in tempObj)
					{
						const tempConverter = tempUnits[curUnitIndex].converter;
						tempObj[key] = tempConverter(tempObj[key]).toFixed(2);
					}
				}
			}
		},
		current: () => tempUnits[curUnitIndex],
	}
})()

document.querySelector('.tempUnitSwitch').addEventListener('click', () =>
{
	temperature.toggle();
	if(currentWeather) displayWeatherInfo(currentWeather);
})

// Start
const options = {
	q: 'cabuyao',
	units: temperature.current().system,
}

getWeather(options).then(weather =>
	{
		currentWeather = weather;
		displayWeatherInfo(weather);
	})