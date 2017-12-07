import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Input from 'react-input-autosize';
import classNames from 'classnames';
import createReactClass from 'create-react-class';

import stripDiacritics from './utils/stripDiacritics';

import Async from './Async';
import Option from './Option';
import Value from './Value';
import Arrow from './Arrow';

function stringifyValue (value) {
	if (typeof value === 'object') {
		return JSON.stringify(value);
	} else {
		return value;
	}
}

const stringOrNode = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.node
]);

export const propTypes = {
	addLabelText: PropTypes.string,       // placeholder displayed when you want to add a label on a multi-value input
	allowCreate: PropTypes.bool,          // whether to allow creation of new entries
	arrowComponent: PropTypes.func,				// customized arrow component to render
	autoBlur: PropTypes.bool,             // automatically blur the component when an option is selected
	autofocus: PropTypes.bool,            // autofocus the component on mount
	autosize: PropTypes.bool,             // whether to enable autosizing or not
	backspaceRemoves: PropTypes.bool,     // whether backspace removes an item if there is no text input
	className: PropTypes.string,          // className for the outer element
	clearAllText: stringOrNode,                 // title for the "clear" control when multi: true
	clearValueText: stringOrNode,               // title for the "clear" control
	clearable: PropTypes.bool,            // should it be possible to reset value
	delimiter: PropTypes.string,          // delimiter to use to join multiple values for the hidden field value
	disabled: PropTypes.bool,             // whether the Select is disabled or not
	escapeClearsValue: PropTypes.bool,    // whether escape clears the value when the menu is closed
	filterOption: PropTypes.func,         // method to filter a single option (option, filterString)
	filterOptions: PropTypes.any,         // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
	hierarchical: PropTypes.bool,         // whether to render options as hierarchical list
	ignoreAccents: PropTypes.bool,        // whether to strip diacritics when filtering
	ignoreCase: PropTypes.bool,           // whether to perform case-insensitive filtering
	inputProps: PropTypes.object,         // custom attributes for the Input
	inputRenderer: PropTypes.func,        // returns a custom input component
	isLoading: PropTypes.bool,            // whether the Select is loading externally or not (such as options being loaded)
	joinValues: PropTypes.bool,           // joins multiple values into a single form field with the delimiter (legacy mode)
	labelKey: PropTypes.string,           // path of the label value in option objects
	matchPos: PropTypes.string,           // (any|start) match the start or entire string when filtering
	matchProp: PropTypes.string,          // (any|label|value) which option property to filter on
	menuBuffer: PropTypes.number,         // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
	menuContainerStyle: PropTypes.object, // optional style to apply to the menu container
	menuRenderer: PropTypes.func,         // renders a custom menu with options
	menuStyle: PropTypes.object,          // optional style to apply to the menu
	multi: PropTypes.bool,                // multi-value input
	name: PropTypes.string,               // generates a hidden <input /> tag with this field name for html forms
	newOptionCreator: PropTypes.func,     // factory to create new options when allowCreate set
	noResultsText: stringOrNode,                // placeholder displayed when there are no matching search results
	onBlur: PropTypes.func,               // onBlur handler: function (event) {}
	onBlurResetsInput: PropTypes.bool,    // whether input is cleared on blur
	onChange: PropTypes.func,             // onChange handler: function (newValue) {}
	onClose: PropTypes.func,              // fires when the menu is closed
	onFocus: PropTypes.func,              // onFocus handler: function (event) {}
	onInputChange: PropTypes.func,        // onInputChange handler: function (inputValue) {}
	onMenuScrollToBottom: PropTypes.func, // fires when the menu is scrolled to the bottom; can be used to paginate options
	onOpen: PropTypes.func,               // fires when the menu is opened
	onValueRemove: PropTypes.func,				// onRemove handler for valueComponent: function(value, event) {}
	onValueClick: PropTypes.func,         // onClick handler for value labels: function (value, event) {}
	openAfterFocus: PropTypes.bool,		// boolean to enable opening dropdown when focused
	openOnFocus: PropTypes.bool,          // always open options menu on focus
	optionClassName: PropTypes.string,    // additional class(es) to apply to the <Option /> elements
	optionComponent: PropTypes.func,      // option component to render in dropdown
	optionRenderer: PropTypes.func,       // optionRenderer: function (option) {}
	optionStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.func,
	]),																					// styles to pass to <Option />; if a func, passed option object
	options: PropTypes.array,             // array of options
	placeholder: stringOrNode,                  // field placeholder, displayed when there's no value
	required: PropTypes.bool,             // applies HTML5 required attribute when needed
	resetValue: PropTypes.any,            // value to use when you clear the control
	scrollMenuIntoView: PropTypes.bool,   // boolean to enable the viewport to shift so that the full menu fully visible when engaged
	searchable: PropTypes.bool,           // whether to enable searching feature or not
	simpleValue: PropTypes.bool,          // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
	style: PropTypes.object,              // optional style to apply to the control
	tabIndex: PropTypes.string,           // optional tab index of the control
	tabSelectsValue: PropTypes.bool,      // whether to treat tabbing out while focused to be value selection
	value: PropTypes.any,                 // initial field value
	valueComponent: PropTypes.func,       // value component to render
	valueKey: PropTypes.string,           // path of the label value in option objects
	valueRenderer: PropTypes.func,        // valueRenderer: function (option) {}
	wrapperStyle: PropTypes.object,       // optional style to apply to the component wrapper
};

const Select = createReactClass({

	displayName: 'Select',

	propTypes: propTypes,

	statics: { Async },

	getDefaultProps () {
		return {
			addLabelText: 'Add "{label}"?',
			arrowComponent: Arrow,
			autosize: true,
			allowCreate: false,
			backspaceRemoves: true,
			clearable: true,
			clearAllText: 'Clear all',
			clearValueText: 'Clear value',
			delimiter: ',',
			disabled: false,
			escapeClearsValue: true,
			filterOptions: true,
			ignoreAccents: true,
			ignoreCase: true,
			inputProps: {},
			isLoading: false,
			joinValues: false,
			labelKey: 'label',
			matchPos: 'any',
			matchProp: 'any',
			menuBuffer: 0,
			multi: false,
			noResultsText: 'No results found',
			onBlurResetsInput: true,
			openAfterFocus: false,
			optionComponent: Option,
			placeholder: 'Select...',
			required: false,
			resetValue: null,
			scrollMenuIntoView: true,
			searchable: true,
			simpleValue: false,
			tabSelectsValue: true,
			valueComponent: Value,
			valueKey: 'value',
		};
	},

	getInitialState () {
		return {
			inputValue: '',
			isFocused: false,
			isLoading: false,
			isOpen: false,
			isPseudoFocused: false,
			required: false,
		};
	},

	componentWillMount () {
		const valueArray = this.getValueArray(this.props.value);

		if (this.props.required) {
			this.setState({
				required: this.handleRequired(valueArray[0], this.props.multi),
			});
		}
	},

	componentDidMount () {
		if (this.props.autofocus) {
			this.focus();
		}
	},

	componentWillReceiveProps(nextProps) {
		const valueArray = this.getValueArray(nextProps.value);

		if (nextProps.required) {
			this.setState({
				required: this.handleRequired(valueArray[0], nextProps.multi),
			});
		}
	},

	componentWillUpdate (nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			const handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
			handler && handler();
		}
	},

	componentDidUpdate (prevProps, prevState) {
		// focus to the selected option
		if (this.refs.menu && this.refs.focused && this.state.isOpen && !this.hasScrolledToOption) {
			let focusedOptionNode = ReactDOM.findDOMNode(this.refs.focused);
			let menuNode = ReactDOM.findDOMNode(this.refs.menu);
			menuNode.scrollTop = focusedOptionNode.offsetTop;
			this.hasScrolledToOption = true;
		} else if (!this.state.isOpen) {
			this.hasScrolledToOption = false;
		}

		if (this._scrollToFocusedOptionOnUpdate && this.refs.focused && this.refs.menu) {
			this._scrollToFocusedOptionOnUpdate = false;
			var focusedDOM = ReactDOM.findDOMNode(this.refs.focused);
			var menuDOM = ReactDOM.findDOMNode(this.refs.menu);
			var focusedRect = focusedDOM.getBoundingClientRect();
			var menuRect = menuDOM.getBoundingClientRect();
			if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
				menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
			}
		}
		if (this.props.scrollMenuIntoView && this.refs.menuContainer) {
			var menuContainerRect = this.refs.menuContainer.getBoundingClientRect();
			if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
				window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
			}
		}
		if (prevProps.disabled !== this.props.disabled) {
			this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
		}
	},

	focus() {
		if (!this.state.isOpen && (this.props.openAfterFocus || this._openAfterFocus)) {
			this.setState({
				isOpen: true,
			}, () => {
        if (this.refs.input) this.refs.input.focus();
      });
		}
	},

	blurInput() {
		if (!this.refs.input) return;
		this.refs.input.blur();
	},

	handleTouchMove (event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart (event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	handleTouchEnd (event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Fire the mouse events
		this.handleMouseDown(event);
	},

	handleTouchEndClearValue (event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Clear the value
		this.clearValue(event);
	},

	handleMouseDown (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
			return;
		}

		if (event.target.tagName === 'INPUT') {
			return;
		}

		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();

		// for the non-searchable select, toggle the menu
		if (!this.props.searchable) {
			this.focus();
			return this.setState({
				isOpen: !this.state.isOpen,
			});
		}

		if (this.state.isOpen) {
		  return this.closeMenu();
    }

		if (this.state.isFocused) {
			// On iOS, we can get into a state where we think the input is focused but it isn't really,
			// since iOS ignores programmatic calls to input.focus() that weren't triggered by a click event.
			// Call focus() again here to be safe.
			this.focus();

			// clears value so that the cursor will be a the end of input then the component re-renders
			if (this.refs.input) this.refs.input.value = '';

			// if the input is focused, ensure the menu is open
			this.setState({
				isOpen: true,
				isPseudoFocused: false,
			});
		} else {
			// otherwise, focus the input and open the menu
			this._openAfterFocus = true;
			this.focus();
		}
	},

	handleMouseDownOnArrow (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
			return;
		}
		// If the menu isn't open, let the event bubble to the main handleMouseDown
		if (!this.state.isOpen) {
			return;
		}
		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();
		// close the menu
		this.closeMenu();
	},

	handleMouseDownOnMenu (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();

		this._openAfterFocus = true;
		this.focus();
	},

	closeMenu () {
		this.setState({
			isOpen: false,
      isFocused: false,
      isPseudoFocused: false,
			inputValue: '',
		});
		this.hasScrolledToOption = false;
	},

	handleInputFocus (event) {
		var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
		this.setState({
			isFocused: true,
			isOpen: isOpen
		});
		this._openAfterFocus = false;
	},

	handleInputBlur (event) {
		if (this.refs.menu && document.activeElement === this.refs.menu) {
			this.focus();
			return;
		}

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
		var onBlurredState = {
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false,
		};
		if (this.props.onBlurResetsInput) {
			onBlurredState.inputValue = '';
		}
		this.setState(onBlurredState);
	},

	handleInputChange (event) {
		let newInputValue = event.target.value;
		if (this.state.inputValue !== event.target.value && this.props.onInputChange) {
			let nextState = this.props.onInputChange(newInputValue);
			// Note: != used deliberately here to catch undefined and null
			if (nextState != null && typeof nextState !== 'object') {
				newInputValue = '' + nextState;
			}
		}
		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: newInputValue
		});
	},

	handleKeyDown (event) {
		if (this.props.disabled) return;
		switch (event.keyCode) {
			case 8: // backspace
				if (!this.state.inputValue && this.props.backspaceRemoves) {
					event.preventDefault();
					this.popValue();
				}
			return;
			case 9: // tab
				if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
					return;
				}
				this.selectFocusedOption();
			return;
			case 13: // enter
				if (!this.state.isOpen) return;
				event.stopPropagation();
				this.selectFocusedOption();
			break;
			case 27: // escape
				if (this.state.isOpen) {
					this.closeMenu();
				} else if (this.props.clearable && this.props.escapeClearsValue) {
					this.clearValue(event);
				}
			break;
			case 38: // up
				this.focusPreviousOption();
			break;
			case 40: // down
				this.focusNextOption();
			break;
			// case 188: // ,
			// 	if (this.props.allowCreate && this.props.multi) {
			// 		event.preventDefault();
			// 		event.stopPropagation();
			// 		this.selectFocusedOption();
			// 	} else {
			// 		return;
			// 	}
			// break;
			default: return;
		}
		event.preventDefault();
	},

	handleValueClick (option, event) {
		if (!this.props.onValueClick) return;
		this.props.onValueClick(option, event);
	},

	handleMenuScroll (event) {
		if (!this.props.onMenuScrollToBottom) return;
		let { target } = event;
		if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
			this.props.onMenuScrollToBottom();
		}
	},

	handleRequired (value, multi) {
		if (!value) return true;
		return (multi ? value.length === 0 : Object.keys(value).length === 0);
	},

	getOptionLabel (op) {
		return op[this.props.labelKey];
	},

	getValueArray (value) {
		if (this.props.multi) {
			if (typeof value === 'string') value = value.split(this.props.delimiter);
			if (!Array.isArray(value)) {
				if (value === null || value === undefined) return [];
				value = [value];
			}
			return value.map(this.expandValue).filter(i => i);
		}
		var expandedValue = this.expandValue(value);
		return expandedValue ? [expandedValue] : [];
	},

	expandValue (value) {
		if (typeof value !== 'string' && typeof value !== 'number') return value;
		let { options, valueKey } = this.props;
		if (!options) return;
		for (var i = 0; i < options.length; i++) {
			if (options[i][valueKey] === value) return options[i];
		}
	},

	setValue (value) {
		if (this.props.autoBlur){
			this.blurInput();
		}
		if (!this.props.onChange) return;
		if (this.props.required) {
			const required = this.handleRequired(value, this.props.multi);
			this.setState({ required });
		}
		if (this.props.simpleValue && value) {
			value = this.props.multi ? value.map(i => i[this.props.valueKey]).join(this.props.delimiter) : value[this.props.valueKey];
		}
		this.props.onChange(value);
	},

	selectValue (value) {
		this.hasScrolledToOption = false;
		if (this.props.multi) {
			this.props.value.indexOf(value) !== -1
				? this.removeValue(value)
				: this.addValue(value);
			this.setState({
				inputValue: '',
			});
		} else {
			this.setValue(value);
			this.closeMenu();
		}
	},

	addValue (value) {
		var valueArray = this.getValueArray(this.props.value);
		this.setValue(valueArray.concat(value));
	},

	popValue () {
		var valueArray = this.getValueArray(this.props.value);
		if (!valueArray.length) return;
		if (valueArray[valueArray.length-1].clearableValue === false) return;
		this.setValue(valueArray.slice(0, valueArray.length - 1));
	},

	removeValue (value) {
		var valueArray = this.getValueArray(this.props.value);
		this.setValue(valueArray.filter(i => i !== value));
		this.focus();
	},

	clearValue (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.setValue(this.props.resetValue);
		if (this.state.isOpen) this.closeMenu();
	},

	focusOption (option) {
		this.setState({
			focusedOption: option
		});
	},

	focusNextOption () {
		this.focusAdjacentOption('next');
	},

	focusPreviousOption () {
		this.focusAdjacentOption('previous');
	},

	focusAdjacentOption (dir) {
		var options = this._visibleOptions.filter(i => !i.disabled);
		this._scrollToFocusedOptionOnUpdate = true;
		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
				inputValue: '',
				focusedOption: this._focusedOption || options[dir === 'next' ? 0 : options.length - 1]
			});
			return;
		}
		if (!options.length) return;
		var focusedIndex = -1;
		for (var i = 0; i < options.length; i++) {
			if (this._focusedOption === options[i]) {
				focusedIndex = i;
				break;
			}
		}
		var focusedOption = options[0];
		if (dir === 'next' && focusedIndex > -1 && focusedIndex < options.length - 1) {
			focusedOption = options[focusedIndex + 1];
		} else if (dir === 'previous') {
			if (focusedIndex > 0) {
				focusedOption = options[focusedIndex - 1];
			} else {
				focusedOption = options[options.length - 1];
			}
		}
		this.setState({
			focusedOption: focusedOption
		});
	},

	selectFocusedOption () {
		// if (this.props.allowCreate && !this.state.focusedOption) {
		// 	return this.selectValue(this.state.inputValue);
		// }
		if (this._focusedOption) {
			return this.selectValue(this._focusedOption);
		}
	},

	renderLoading () {
		if (!this.props.isLoading) return;
		return (
			<span className="Select-loading-zone" aria-hidden="true">
				<span className="Select-loading" />
			</span>
		);
	},

	renderValue (valueArray, isOpen) {
		let renderLabel = this.props.valueRenderer || this.getOptionLabel;
		let ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return <div className="Select-placeholder">{this.props.placeholder}</div>;
		}
		let onClick = this.props.onValueClick ? this.handleValueClick : undefined;
		const onRemove = this.props.onValueRemove || this.removeValue;

		if (this.props.multi) {
      // pass in full valueArray, and stop mapping over the ValueComponent when multi === true
      return (
        <ValueComponent
          disabled={this.props.disabled}
          onClick={onClick}
          onRemove={onRemove}
          value={valueArray}
        >
          {renderLabel({placeholder: this.props.placeholder})}
        </ValueComponent>
      );
    }

    if (isOpen) onClick = null;
    return (
      <ValueComponent
        disabled={this.props.disabled}
        onClick={onClick}
        value={valueArray[0]}
        >
        {renderLabel(valueArray[0])}
      </ValueComponent>
    );
	},

	renderInput (valueArray) {
		if (this.props.inputRenderer) {
			return this.props.inputRenderer();
		} else {
			var className = classNames('Select-input', this.props.inputProps.className);
			if (this.props.disabled || !this.props.searchable) {
				return (
					<div
						{...this.props.inputProps}
						className={className}
						tabIndex={this.props.tabIndex || 0}
						onBlur={this.handleInputBlur}
						onFocus={this.handleInputFocus}
						ref="input"
						style={{ border: 0, width: 1, display:'inline-block' }}
					/>
				);
			}
			if (this.props.autosize) {
				return (
					<Input
						{...this.props.inputProps}
						className={className}
						tabIndex={this.props.tabIndex}
						onBlur={this.handleInputBlur}
						onChange={this.handleInputChange}
						onFocus={this.handleInputFocus}
						minWidth="5"
						ref="input"
						required={this.state.required}
						value={this.state.inputValue}
					/>
				);
			}
			return (
				<div className={ className }>
					<input
						{...this.props.inputProps}
						tabIndex={this.props.tabIndex}
						onBlur={this.handleInputBlur}
						onChange={this.handleInputChange}
						onFocus={this.handleInputFocus}
						onKeyDown={this.handleKeyDown}
						ref="input"
						required={this.state.required}
						value={this.state.inputValue}
					/>
				</div>
			);
		}
	},

	renderClear () {
		if (!this.props.clearable || !this.props.value || (this.props.multi && !this.props.value.length) || this.props.disabled || this.props.isLoading) return;
		return (
			<span className="Select-clear-zone" title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						onMouseDown={this.clearValue}
						onTouchStart={this.handleTouchStart}
						onTouchMove={this.handleTouchMove}
						onTouchEnd={this.handleTouchEndClearValue}>
				<span className="Select-clear" dangerouslySetInnerHTML={{ __html: '&times;' }} />
			</span>
		);
	},

	renderArrow () {
		const ArrowComponent = this.props.arrowComponent;
		return (
			<ArrowComponent
				onMouseDown={this.handleMouseDownOnArrow}
			/>
		);
	},

	filterOptions (excludeOptions) {
		var filterValue = this.state.inputValue;
		var options = this.props.options || [];
		if (typeof this.props.filterOptions === 'function') {
			return this.props.filterOptions.call(this, options, filterValue, excludeOptions);
		} else if (this.props.filterOptions) {
			if (this.props.ignoreAccents) {
				filterValue = stripDiacritics(filterValue);
			}
			if (this.props.ignoreCase) {
				filterValue = filterValue.toLowerCase();
			}
			if (excludeOptions) excludeOptions = excludeOptions.map(i => i[this.props.valueKey]);
			return options.filter(option => {
				if (excludeOptions && excludeOptions.indexOf(option[this.props.valueKey]) > -1) return false;
				if (this.props.filterOption) return this.props.filterOption.call(this, option, filterValue);
				if (!filterValue) return true;
				var valueTest = String(option[this.props.valueKey]);
				var labelTest = String(option[this.props.labelKey]);
				if (this.props.ignoreAccents) {
					if (this.props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
					if (this.props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
				}
				if (this.props.ignoreCase) {
					if (this.props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
					if (this.props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
				}
				return this.props.matchPos === 'start' ? (
					(this.props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
					(this.props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
				) : (
					(this.props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0) ||
					(this.props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0)
				);
			});
		} else {
			return options;
		}
	},

	renderMenu (options, valueArray, focusedOption) {
		if (options && options.length) {
			if (this.props.menuRenderer) {
				return this.props.menuRenderer({
					focusedOption,
					focusOption: this.focusOption,
					hierarchical: this.props.hierarchical,
					labelKey: this.props.labelKey,
					multi: this.props.multi,
					options,
					optionClassName: this.props.optionClassName,
					optionRenderer: this.props.optionRenderer,
					optionStyle: this.props.optionStyle,
					selectValue: this.selectValue,
					valueArray,
				});
			} else {
				let Option = this.props.optionComponent;
				let renderLabel = this.props.optionRenderer || this.getOptionLabel;

				return options.map((option, i) => {
					let isSelected = valueArray && valueArray.indexOf(option) > -1;
					let isFocused = option === focusedOption;
					let optionRef = isFocused ? 'focused' : null;
					let optionClass = classNames(this.props.optionClassName, {
						'Select-option': true,
						'is-selected': isSelected,
						'is-focused': isFocused,
						'is-disabled': option.disabled,
					});

					return (
						<Option
							className={optionClass}
							isDisabled={option.disabled}
							isFocused={isFocused}
							isSelected={isSelected}
							key={`option-${i}-${option[this.props.valueKey]}`}
							onSelect={this.selectValue}
							onFocus={this.focusOption}
							option={option}
							ref={optionRef}
							style={this.props.optionStyle}
						>
							{renderLabel(option)}
						</Option>
					);
				});
			}
		} else if (this.props.noResultsText) {
			return (
				<div className="Select-noresults">
					{this.props.noResultsText}
				</div>
			);
		} else {
			return null;
		}
	},

	renderHiddenField (valueArray) {
		if (!this.props.name) return;
		if (this.props.joinValues) {
			let value = valueArray.map(i => stringifyValue(i[this.props.valueKey])).join(this.props.delimiter);
			return (
				<input
					type="hidden"
					ref="value"
					name={this.props.name}
					value={value}
					disabled={this.props.disabled} />
			);
		}
		return valueArray.map((item, index) => (
			<input key={'hidden.' + index}
				type="hidden"
				ref={'value' + index}
				name={this.props.name}
				value={stringifyValue(item[this.props.valueKey])}
				disabled={this.props.disabled} />
		));
	},

	getFocusableOption (selectedOption) {
		var options = this._visibleOptions;
		if (!options.length) return;
		let focusedOption = this.state.focusedOption || selectedOption;
		if (focusedOption && options.indexOf(focusedOption) > -1) return focusedOption;
		for (var i = 0; i < options.length; i++) {
			if (!options[i].disabled) return options[i];
		}
	},

	renderOuter (options, valueArray, focusedOption) {
		let menu = this.renderMenu(options, valueArray, focusedOption);
		if (!menu) {
			return null;
		}

		return (
			<div ref="menuContainer" className="Select-menu-outer" style={this.props.menuContainerStyle}>
        {this.renderInput(valueArray)}
				<div ref="menu" className="Select-menu"
						 style={this.props.menuStyle}
						 onScroll={this.handleMenuScroll}
						 onMouseDown={this.handleMouseDownOnMenu}>
					{menu}
				</div>
			</div>
		);
	},

	render () {
		let valueArray = this.getValueArray(this.props.value);
		let options = this._visibleOptions = this.filterOptions(null);
		let isOpen = this.state.isOpen;
		if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
		let focusedOption = this._focusedOption = this.getFocusableOption(valueArray[0]);
		let className = classNames('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'Select--single': !this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.state.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': isOpen,
			'is-pseudo-focused': this.state.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': valueArray.length,
		});

		return (
			<div
        ref="wrapper"
        className={className}
        style={this.props.wrapperStyle}
        onBlur={this.closeMenu}
      >
				{this.renderHiddenField(valueArray)}
				<div ref="control"
						 className="Select-control"
						 style={this.props.style}
						 onKeyDown={this.handleKeyDown}
						 onMouseDown={this.handleMouseDown}
						 onTouchEnd={this.handleTouchEnd}
						 onTouchStart={this.handleTouchStart}
						 onTouchMove={this.handleTouchMove}>
					{this.renderValue(valueArray, isOpen)}
					{this.renderLoading()}
					{this.renderClear()}
					{this.renderArrow()}
				</div>
				{isOpen ? this.renderOuter(options, valueArray, focusedOption) : null}
			</div>
		);
	}

});

export default Select;
