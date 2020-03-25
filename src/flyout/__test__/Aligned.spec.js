/* eslint-env jest */

/**
 * Cases from the triggered spec that need to be added here
 * are commented out below
 */

describe('Aligned Flyout Tests', () => {
	test('Add more Tests', () => {
		expect(true).toBeTruthy();
	});

	// test('alignment shorts if closed', () => {
	// 	const renderer = verify( <Flyout />, {createNodeMock});

	// 	const inst = renderer.getInstance();

	// 	jest.spyOn(inst, 'setState');
	// 	const {alignment} = inst.state;

	// 	inst.align();

	// 	expect(inst.setState).toHaveBeenCalledWith({aligning: false, alignment}, undefined);
	// });
	

	// test('Transition Support', () => {
	// 	jest.useFakeTimers();
	// 	const renderer = verify( <Flyout transition={{className: 'fade', timeout: 500}} />, {createNodeMock});
	// 	const inst = renderer.getInstance();

	// 	expect(inst.state).toEqual({alignment: {}});

	// 	inst.doOpen();

	// 	expect(renderer.toJSON()).toMatchSnapshot();
	// 	expect(inst.state).toEqual({
	// 		aligning: false,
	// 		alignment: expect.anything(),
	// 		closing: false,
	// 		open: true,
	// 		opening: true,
	// 	});

	// 	jest.runAllTimers();

	// 	expect(renderer.toJSON()).toMatchSnapshot();
	// 	expect(inst.state).toEqual({
	// 		aligning: false,
	// 		alignment: expect.anything(),
	// 		closing: false,
	// 		open: true,
	// 		opening: false,
	// 	});

	// 	inst.doClose();

	// 	expect(renderer.toJSON()).toMatchSnapshot();
	// 	expect(inst.state).toEqual({
	// 		aligning: false,
	// 		alignment: expect.anything(),
	// 		closing: true,
	// 		open: true,
	// 		opening: false,
	// 	});

	// 	jest.runAllTimers();

	// 	expect(renderer.toJSON()).toMatchSnapshot();
	// 	expect(inst.state).toEqual({
	// 		aligning: true,
	// 		alignment: expect.anything(),
	// 		closing: false,
	// 		open: false,
	// 		opening: false,
	// 	});
	// });
	
	// test('scrolling realigns', () => {
	// 	let listener;
	// 	jest.spyOn(document, 'addEventListener')
	// 		.mockImplementation((evName, handler) => listener = handler);


	// 	const renderer = verify( <Flyout open/>, {
	// 		createNodeMock ({type}) {
	// 			const el = document.createElement(type);

	// 			document.body.appendChild(el);
	// 			return el;
	// 		}
	// 	});

	// 	expect(document.addEventListener).toHaveBeenCalled();

	// 	const inst = renderer.getInstance();
	// 	jest.spyOn(inst, 'realign');

	// 	listener({target: {contains: () => false}});
	// 	expect(inst.realign).not.toHaveBeenCalled();

	// 	listener({target: document});

	// 	expect(inst.realign).toHaveBeenCalled();
	// });
	
	// test('constrained alignment does not limit height for non-top-aligned, non-fixed flyouts', () => {
	// 	jest.useFakeTimers();
	// 	const renderer = verify( <Flyout constrain open verticalAlign={Flyout.ALIGNMENTS.BOTTOM}><div/></Flyout>, {createNodeMock});

	// 	const inst = renderer.getInstance();

	// 	inst.align();

	// 	jest.runAllTimers();

	// 	expect(inst.state.alignment).not.toHaveProperty('maxHeight');
	// });


	// test('zIndex resolition', () => {
	// 	document.body.innerHTML = `
	// 		<div>
	// 			<div class="foo" style="z-index: 10; position: absolute; top:100px; left:100px;"></div>
	// 		</div>
	// 	`;

	// 	const div = document.body.querySelector('div.foo');

	// 	const renderer = verify(
	// 		<Flyout open constrain>
	// 			<div>My Flyout Content</div>
	// 		</Flyout>,
	// 		{createNodeMock ({type}) {
	// 			const el = document.createElement(type);
	// 			//the default trigger is a button.
	// 			if (type === 'button') {
	// 				div.appendChild(el);
	// 			}
	// 			return el;
	// 		}}
	// 	);

	// 	const flyout = renderer.root.find(({type, props}) =>
	// 		type === 'div'
	// 		&& props.style != null
	// 		&& props.className
	// 		&& props.className.split(' ').filter(RegExp.prototype.test.bind(/opened|flyout/)).length === 2
	// 	);

	// 	expect(flyout.props.style.zIndex).toBe(11);
	// });


	// test('position fixed resolition', () => {
	// 	document.body.innerHTML = `
	// 		<div>
	// 			<div class="foo" style="z-index: 10; position: fixed; top:100px; left:100px;"></div>
	// 		</div>
	// 	`;

	// 	const div = document.body.querySelector('div.foo');

	// 	const renderer = verify(
	// 		<Flyout open constrain>
	// 			<div>My Flyout Content</div>
	// 		</Flyout>,
	// 		{createNodeMock ({type}) {
	// 			const el = document.createElement(type);
	// 			//the default trigger is a button.
	// 			if (type === 'button') {
	// 				div.appendChild(el);
	// 			}
	// 			return el;
	// 		}}
	// 	);

	// 	const flyout = renderer.root.find(({type, props}) =>
	// 		type === 'div'
	// 		&& props.style != null
	// 		&& props.className
	// 		&& props.className.split(' ').filter(RegExp.prototype.test.bind(/opened|flyout/)).length === 2
	// 	);

	// 	expect(flyout.props.style.position).toBe('fixed');
	// });
	
	// test('Opening the flyout should add listeners to window, and document', async () => {
	// 	jest.spyOn(window, 'addEventListener');
	// 	jest.spyOn(window, 'removeEventListener');
	// 	jest.spyOn(window.document, 'addEventListener');
	// 	jest.spyOn(window.document, 'removeEventListener');

	// 	let step = null;

	// 	function afterAlign () {
	// 		step();
	// 	}

	// 	const renderer = verify(
	// 		<Flyout afterAlign={afterAlign}>
	// 			<div>Foobar</div>
	// 		</Flyout>,
	// 		{createNodeMock}
	// 	);

	// 	const component = renderer.getInstance();
	// 	const event = {
	// 		isPropagationStopped: () => false,
	// 		preventDefault: jest.fn(),
	// 		stopPropagation: jest.fn(),
	// 	};

	// 	await new Promise(next =>{
	// 		step = next;
	// 		component.onToggle(event);
	// 	});

	// 	expect(event.preventDefault).toHaveBeenCalled();
	// 	expect(event.stopPropagation).toHaveBeenCalled();

	// 	expect(window.addEventListener).toHaveBeenCalledWith('resize', component.realign);
	// 	// expect(window.addEventListener).toHaveBeenCalledWith('scroll', component.realign);
	// 	// expect(window.document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));


	// 	jest.spyOn(component, 'doClose');
	// 	jest.spyOn(component, 'doOpen');
	// 	event.isPropagationStopped = () => true;
	// 	event.preventDefault.mockClear();
	// 	event.stopPropagation.mockClear();

	// 	component.onToggle(event);

	// 	expect(component.doClose).not.toHaveBeenCalled();
	// 	expect(component.doOpen).not.toHaveBeenCalled();
	// 	expect(event.stopPropagation).not.toHaveBeenCalled();
	// 	expect(event.preventDefault).not.toHaveBeenCalled();
	// });


	// test('Closing the flyout should remove listeners to window, and document', async () => {
	// 	jest.spyOn(window, 'addEventListener');
	// 	jest.spyOn(window, 'removeEventListener');
	// 	jest.spyOn(window.document, 'addEventListener');
	// 	jest.spyOn(window.document, 'removeEventListener');

	// 	let step = null;

	// 	function afterAlign () {
	// 		step();
	// 	}

	// 	const renderer = verify(
	// 		<Flyout afterAlign={afterAlign}>
	// 			<div>Foobar2</div>
	// 		</Flyout>,
	// 		{createNodeMock}
	// 	);

	// 	const component = renderer.getInstance();

	// 	await new Promise(next =>{
	// 		step = next;
	// 		component.onToggle();
	// 	});

	// 	await new Promise(next =>{
	// 		component.onToggle(null, next);
	// 	});

	// 	expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
	// 	// expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
	// 	// expect(window.document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
	// });
	
	// test('Flys echo classnames', async () => {

	// 	const renderer = verify(
	// 		<Flyout className="awesome sauce">
	// 			<div>Lala</div>
	// 		</Flyout>,
	// 		{createNodeMock}
	// 	);

	// 	const component = renderer.getInstance();

	// 	await new Promise(next => component.onToggle(null, next));

	// 	expect(renderer.toJSON()).toMatchSnapshot();
	// });
});