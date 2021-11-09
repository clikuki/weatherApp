const loading = (() =>
{
	const loadingWrapper = document.querySelector('.loadingWrapper');
	const bodyElem = document.body;

	const on = () =>
	{
		bodyElem.classList.add('loading');
		loadingWrapper.classList.remove('hide');
	}

	const off = () =>
	{
		bodyElem.classList.remove('loading');
		loadingWrapper.classList.add('hide');
	}
	
	return {
		on,
		off,
	}
})()
