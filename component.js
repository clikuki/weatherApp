const component = (tag, { props, children } = {}) =>
{
	const element = document.createElement(tag);

	if(props)
	{
		for(const [key, value] of Object.entries(props))
		{
			switch(key)
			{
				case 'style':
					for(const [style, value] of Object.entries(options.style))
					{
						element.style[style] = value;
					}
					break;
	
				default:
					if(typeof value !== 'function') element.setAttribute(key, value);
					else element[key] = value;
					break;
			}
		}
	}

	if(children && children.length > 0)
	{
		element.append(...children);
	}

	return element;
}