const getWeatherInfo = (() =>
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
			if(Array.isArray(value))
			{
				value = value.join(',');
			}

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

		return (obj) => ({
			city: obj.city.name,
			country: obj.city.country,
			forecast: obj.list
				.filter(getFilterCB())
				.map(mapCB)
		})
	})()

	return (paramsObj, isFormatted = true) => fetch(getUrl(paramsObj))
		.then(res => res.json())
		.then((obj) =>
		{
			if(isFormatted) return format(obj);
			else return obj;
		});
})()

const options = {
	q: 'cabuyao',
	units: 'metric',
}

getWeatherInfo(options, !false).then(console.log);
