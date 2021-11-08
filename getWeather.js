const getWeather = (() =>
{
	const APIKEY = '305b82757d0362cfa88bd71f44667aeb';
	const urlBase = 'http://api.openweathermap.org/data/2.5/forecast?';

	const getUrl = (paramsObj) =>
	{
		let paramStr = `APPID=${APIKEY}`;

		for(const key in paramsObj)
		{
			// Allow comma separated values for arrays
			let value = paramsObj[key];
			if(Array.isArray(value)) value = value.join(',');

			paramStr += `&${key}=${value}`;
		}

		return urlBase + paramStr;
	}

	const format = (() =>
	{
		const getFilterCB = () =>
		{
			const days = [];

			return ({ dt_txt }) =>
			{
				// remove time part of dateTime string
				const date = dt_txt.split(' ')[0];

				// If days arr doesn't include the date, push date to arr
				const isFirst = !days.includes(date);
				if(isFirst) days.push(date);

				return isFirst;
			}
		}

		const mapCB = day =>
		{
			const main = day.main;
			return {
				date: new Date(day.dt_txt),
				wind: day.wind,
				humidity: main.humidity,
				weather: day.weather,
				temp: {
					avg: main.temp,
					min: main.temp_min,
					max: main.temp_max,
					feelsLike: main.feels_like,
				},
			}
		}

		const getFormattedDays = (forecast) => forecast.filter(getFilterCB()).map(mapCB);

		const tempLetterMap = {
			kelvin: 'K',
			metric: 'C',
			imperial: 'F',
		}

		return (obj, unit = 'kelvin') => ({
			unit: tempLetterMap[unit],
			location: {
				city: obj.city.name,
				country: obj.city.country,
			},
			forecast: getFormattedDays(obj.list),
		})
	})()

	return (paramsObj, logOriginalObj = false) =>
	{
		return fetch(getUrl(paramsObj))
		.then(res => res.json())
		.then((res) =>
		{
			// For testing
			if(logOriginalObj) console.log(res);
			return format(res, paramsObj.units);
		});
	}
})()

