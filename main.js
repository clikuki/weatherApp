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
	
		return (location, forecastObj) =>
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

	const changeBgClr = (() =>
	{
		const rootElem = document.documentElement;

		const clrArray = [
			{
				// Thunderstorm, Drizzle, Rain
				idRanges: [
					[200, 232],
					[300, 321],
					[500, 531],
				],
				headerClr: '#6a8588',
				bodyClr: '#526466',
			},
			{
				// Snow
				idRanges: [
					[600, 622],
				],
				headerClr: '#a3b1bc',
				bodyClr: '#e8ecf2',
			},
			{
				// Clear, Clouds
				idRanges: [
					[800, 804],
				],
				headerClr: '#bbf1f5',
				bodyClr: '#7EE1E8',
			},
		]

		// Mist, smoke, haze, etc
		// Doesn't have any color associated with it
		const atmosphereRange = [700, 781];

		const getWeatherId = (weatherArray) =>
		{
			let index = 0;

			if(weatherArray[0].id >= atmosphereRange[0]
			&& weatherArray[0].id <= atmosphereRange[1])
			{
				index = 1;
			}
			
			return weatherArray[index].id;
		}

		const getClrs = (weatherId) =>
		{
			for(const clrObj of clrArray)
			{
				for(const range of clrObj.idRanges)
				{
					if(weatherId >= range[0] && weatherId <= range[1])
					{
						return clrObj;
					}
				}
			}
		}

		return (forecastObj) =>
		{
			const weatherArray = forecastObj.weather;
			const weatherId = getWeatherId(weatherArray);
			const { headerClr, bodyClr } = getClrs(weatherId);
			
  			rootElem.style.setProperty('--main-clr', headerClr);
  			rootElem.style.setProperty('--header-clr', bodyClr);
		}
	})()

	return weather =>
	{
		displayCurrDayInfo(weather.location.city, weather.forecast[0]);
		changeBgClr(weather.forecast[0]);
	
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
	q: 'New york',
})
