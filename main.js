// Used for temperature switches
let curWeather = null;

const displayWeather = (() =>
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
			tempDisplay.textContent = temperature.format(forecastObj.temp.avg);
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
					src: `https://openweathermap.org/img/wn/${forecastObj.weather[0].icon}@2x.png`,
					class: 'condition',
				}
			})
		
			const tempDisplay = component('span', {
				children: [
					temperature.format(forecastObj.temp.avg),
				]
			})
		
			const forecastCardElem = component('div', {
				props: {
					class: 'forecast-card',
				},
				children: [
					dayDisplay,
					conditionImg,
					tempDisplay,
				]
			})
		
			return forecastCardElem;
		}
	})()

	return weather =>
	{
		displayCurrDayInfo(weather.location.city, weather.unit, weather.forecast[0]);
	
		const forecastContainerElem = document.querySelector('.forecast-container');
		const forecastCardElems = weather.forecast.map(day => createForecastCard(weather.unit, day))
		forecastContainerElem.replaceChildren(...forecastCardElems);
	};
})()

// Make sure not to pass a temperature option,
// as temperature must be in kelvin for web app to work
const fetchAndDisplayWeather = (options) =>
{
	loading.on();

	return getWeather(options)
		.then(weather =>
		{
			curWeather = weather;
			displayWeather(weather);
		})
		.finally(err =>
		{
			loading.off();

			// Check if it is an actual error
			if(err instanceof Error) return Promise.reject(err);
			else return Promise.resolve(err);
		})
}

const temperature = (() =>
{
	const tempUnits = [
		{
			system: 'metric',
			letter: 'C',
			convert: (temp) => temp - 273.15,
		},
		{
			system: 'imperial',
			letter: 'F',
			convert: (temp) => (temp - 273.15) * 9/5 + 32,
		},
	]

	let curUnitIndex = 0;

	return {
		toggle: () => {
			if(tempUnits.length <= 1) return;
			if(++curUnitIndex >= tempUnits.length) curUnitIndex = 0;

			return tempUnits[curUnitIndex].letter;
		},
		format: (temp) =>
		{
			const curUnit = tempUnits[curUnitIndex];
			const convertedTemp = curUnit.convert(temp).toFixed(2);
			return`${convertedTemp}°${curUnit.letter}`;
		},
		current: () => tempUnits[curUnitIndex],
	}
})()

// Event listeners
document.querySelector('.searchbar input').addEventListener('keydown', e =>
{
	const elem = e.target; 
	const inputVal = elem.value;

	elem.setCustomValidity('');

	if(e.key === 'Enter' && inputVal)
	{
		fetchAndDisplayWeather({ q: inputVal })
			.then(() => elem.value = '')
			.catch(() => elem.setCustomValidity('Invalid city, please enter a valid city'))
	}
})

document.querySelector('.tempUnitSwitch').addEventListener('click', e =>
{
	e.target.textContent = `°${temperature.toggle()}`;
	if(curWeather) displayWeather(curWeather);
})

// Start
fetchAndDisplayWeather({
	q: 'cabuyao',
})
