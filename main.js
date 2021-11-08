let currentWeather = null;

const displayWeatherInfo = (() =>
{
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

	return weather =>
	{
		displayCurrDayInfo(weather.location.city, weather.unit, weather.forecast[0]);
	
		const forecastContainer = document.querySelector('.forecast-container');
		const forecastCardElems = weather.forecast.map(day => createForecastCard(weather.unit, day))
		clearChildren(forecastContainer);
		forecastContainer.append(...forecastCardElems);
	};
})()

const fetchAndDisplayWeather = (options) => getWeather(options, true).then(weather =>
{
	if(weather.unit !== temperature.current().letter) weather = temperature.convert(weather);
	currentWeather = weather;
	displayWeatherInfo(weather);
})

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

	const convertWeatherObjUnits = (weatherObj) =>
	{
		weatherObj.unit = tempUnits[curUnitIndex].letter;
		for(let i = 0; i < weatherObj.forecast.length; i++)
		{
			const weather = weatherObj.forecast[i];
			const tempObj = weather.temp;

			for(const key in tempObj)
			{
				const tempConverter = tempUnits[curUnitIndex].converter;
				tempObj[key] = tempConverter(tempObj[key]).toFixed(2);
			}
		}

		return weatherObj;
	}

	return {
		toggle: () => {
			if(tempUnits.length <= 1) return;
			if(++curUnitIndex >= tempUnits.length) curUnitIndex = 0;

			return tempUnits[curUnitIndex].letter;
		},
		convert: convertWeatherObjUnits,
		current: () => tempUnits[curUnitIndex],
	}
})()

// Event listeners
document.querySelector('.searchbar').addEventListener('keydown', e =>
{
	if(e.key === 'Enter')
	{
		const elem = e.target; 
		const inputVal = elem.value;
		elem.value = '';

		fetchAndDisplayWeather({
			q: inputVal,
			units: temperature.current().system,
		});
	}
})

document.querySelector('.tempUnitSwitch').addEventListener('click', e =>
{
	e.target.textContent = `°${temperature.toggle()}`;
	if(currentWeather)
	{
		currentWeather = temperature.convert(currentWeather);
		displayWeatherInfo(currentWeather);
	}
})

// Start
fetchAndDisplayWeather({
	q: 'cabuyao',
	units: temperature.current().system,
})
