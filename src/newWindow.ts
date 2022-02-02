import { pluginVersion, isDevelopment } from './helpers/environment';
import { debug } from "./helpers/logger";
import { Mode } from './modes';

const currentTheme = {
  theme: "N/A"
}



const windowOptions = {
	windowId: "theme-editor-window",
	widgetLineHeight: 14,
	windowColour: 19
  }

export class PeepEditorWindow {
   /**
	 * Opens the window for the Peep Editor.
	 */

	open(): void {
		const window = ui.getWindow(windowOptions.windowId);
		if (window) {
			debug("The Peep Editor window is already shown.");
			window.bringToFront();
		}
		else {
			let windowTitle = `Park Colour Manager (v${pluginVersion})`;
			if (isDevelopment) {
				windowTitle += " [DEBUG]";
			}

			ui.openWindow({
				onClose: () => {
					toggle = false;
					toggleDisabled = true;
					toggleFreeze = false;
					checkboxDisabled = true;
					colourPickerDisabled = true;
					widgetFreeze = false;
					ui.tool?.cancel();
				},
				classification: windowOptions.windowId,
				title: windowTitle,
				width: 260,
				height: 250,
				colours: [windowOptions.windowColour, windowOptions.windowColour],
				tabs: [
					{
						image: 5628, //staff
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "lts Smitty",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Staff",
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 95,
								width: 240,
								height: 130,
							},
								<LabelWidget>{
									name: staffLabel.id,
									type: "label",
									x: 20,
									y: 73,
									width: 260,
									height: windowOptions.widgetLineHeight,
									text: `Name: {RED}${staffName}`,
									isDisabled: false
								},
							<LabelWidget>{
								name: staffTypeLabel.id,
								type: "label",
								x: 20,
								y: 110,
								width: 140,
								height: windowOptions.widgetLineHeight,
								text: `Type:`,
								isDisabled: true,
							},
							<DropdownWidget>{
								name: stafftypeDropdown.id,
								type: "dropdown",
								x: 75,
								y: 110,
								width: 95,
								height: windowOptions.widgetLineHeight,
								items: ["Handyman", "Mechanic", "Security Guard", "Entertainer"],
								selectedIndex: staffTypeNumber,
								isDisabled: true,
								onChange: (number) => setStaffType(number)
							},
							<LabelWidget>{
								name: costumeLabel.id,
								type: "label",
								x: 20,
								y: 125,
								width: 140,
								height: windowOptions.widgetLineHeight,
								text: `Costume:`,
								isDisabled: true,
							},
							<DropdownWidget>{
								name: costumeDropdown.id,
								type: "dropdown",
								x: 75,
								y: 125,
								width: 95,
								height: windowOptions.widgetLineHeight,
								items: [
									"Panda",				//0
									"Tiger",				//1
									"Elephant",				//2
									"Gladiator",			//3
									"Gorilla",				//4
									"Snowman",				//5
									"Knight",				//6
									"Astronaut",			//7
									"Bandit",				//8
									"Sheriff",				//9
									"Pirate",				//10
									"Icecream",				//11
									"Chips",				//12
									"Burger",				//13
									"Soda can",				//14
									"Balloon",				//15
									"Candyfloss",			//16
									"Umbrella",				//17
									"Pizza",				//18
									"Security",				//19
									"Popcorn",				//20
									"Arms crossed",			//21
									"Head down",			//22
									"Nauseous",				//23
									"Very nauseous",		//24
									"Needs toilet",			//25
									"Hat",					//26
									"Hotdog",				//27
									"Tentacle",				//28
									"Toffee apple",			//29
									"Donut",				//30
									"Coffee",				//31
									"Nuggets",				//32
									"Lemonade",				//33
									"Walking",				//34
									"Pretzel",				//35
									"Sunglasses",			//36
									"Sujongkwa",			//37
									"Juice",				//38
									"Funnel cake",			//39
									"Noodles",				//40
									"Sausage",				//41
									"Soup",					//42
									"Sandwich",				//43
									"Guest",				//252
									"Handyman",				//253
									"Mechanic",				//254
									"Security guard",		//255
								],
								selectedIndex: selectedIndexCostume,
								isDisabled: true,
								onChange: (number) => setCostume(number)
							},
							<ButtonWidget>{
								name: buttonTest.id,
								type: "button",
								border: true,
								x: 185,
								y: 165,
								width: 24,
								height: 24,
								image: 29467,
								isPressed: toggle,
								onClick: () => selectStaff()
							},
							<ButtonWidget>{
								name: buttonLocateStaff.id,
								type: "button",
								border: true,
								x: 211,
								y: 165,
								width: 24,
								height: 24,
								image: 5167, //locate icon
								isPressed: false,
								isDisabled: toggleDisabled,
								onClick: () => gotoStaff()
							},
							<ButtonWidget>{
								name: freeze.id,
								type: "button",
								border: true,
								x: 185,
								y: 191,
								width: 24,
								height: 24,
								image: 5182, //red/green flag
								isPressed: toggleFreeze,
								isDisabled: toggleDisabled,
								onClick: () => buttonFreeze()
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 220,
								y: 73,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: staffColourPicker.id,
								tooltip: "Change staff colour",
								isDisabled: colourPickerDisabled,
								colour: 0,
								onChange: (colour) => staffColourSet(colour),
							},
							<ViewportWidget>{
								type: "viewport",
								name: viewport.id,
								x: 185,
								y: 110,
								width: 50,
								height: 50,
								viewport: {
									left: blackViewport.x,
									top: blackViewport.y,
								}
							},
						]
					},
					{
						image: { frameBase: 5221, frameCount: 8, frameDuration: 4, },
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Colours",
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 80,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.tshirtColour.id,
								tooltip: "Change guests shirts",
								isDisabled: false,
								colour: guestColourOptions.tshirtColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('tshirtColour',colour),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 80,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: "Shirts",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 100,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.trousersColour.id,
								tooltip: "Change guests trousers",
								isDisabled: false,
								colour: guestColourOptions.trousersColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('trousersColour',colour),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 100,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: "Trousers",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 120,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.balloonColour.id,
								tooltip: "Change guests balloons",
								isDisabled: false,
								colour: guestColourOptions.balloonColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('balloonColour',colour),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 120,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: "Balloons",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 140,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.hatColour.id,
								tooltip: "Change guests hats",
								isDisabled: false,
								colour: guestColourOptions.hatColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('hatColour',colour),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 140,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: "Hats",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 160,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.umbrellaColour.id,
								tooltip: "Change guests umbrellas",
								isDisabled: false,
								colour: guestColourOptions.balloonColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('umbrellaColour',colour),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 160,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: "Umbrellas",
								isDisabled: false
							},
						],
					},
					{
						image: {
							frameBase: 5318,	//pointing hand
							frameCount: 8,
							frameDuration: 2,
						},
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Flags",
							},
							<CheckboxWidget>{
								name: widgetProps.litter.id,
								type: "checkbox",
								x: 20,
								y: 78,
								width: 100,
								height: 15,
								text: "Litter",
								tooltip: "Lets guests behave like pigs",
								isChecked: widgetProps.litter.toggle,
								onChange: () => this.ToggleGuestFlags("litter"),
							},
							<CheckboxWidget>{
								name: widgetProps.explode.id,
								type: "checkbox",
								x: 20,
								y: 98,
								width: 100,
								height: 15,
								text: "Explode",
								tooltip: "Execute Order 66",
								isChecked: widgetProps.explode.toggle,
								onChange: () => this.ToggleGuestFlags("explode"),
							},
							<CheckboxWidget>{
								name: widgetProps.leavingPark.id,
								type: "checkbox",
								x: 20,
								y: 118,
								width: 100,
								height: 15,
								text: "Leave park",
								tooltip: "Evacuate park",
								isChecked: widgetProps.leavingPark.toggle,
								onChange: () => this.ToggleGuestFlags("leavingPark"),
							},
							<CheckboxWidget>{
								name: widgetProps.slowWalk.id,
								type: "checkbox",
								x: 20,
								y: 138,
								width: 100,
								height: 15,
								text: "Slow walk",
								tooltip: "Give the guests the Iron Boots from 'Ocarina of Time'",
								isChecked: widgetProps.slowWalk.toggle,
								onChange: () => this.ToggleGuestFlags("slowWalk"),
							},
							<CheckboxWidget>{
								name: widgetProps.tracking.id,
								type: "checkbox",
								x: 20,
								y: 158,
								width: 100,
								height: 15,
								text: "Track your guests",
								tooltip: "Vaccinate all of your guests with tracking chips",
								isChecked: widgetProps.tracking.toggle,
								onChange: () => this.ToggleGuestFlags("tracking"),
							},
							<CheckboxWidget>{
								name: widgetProps.waving.id,
								type: "checkbox",
								x: 20,
								y: 178,
								width: 100,
								height: 15,
								text: "Wave",
								tooltip: "'Hey Everyone'",
								isChecked: widgetProps.waving.toggle,
								onChange: () => this.ToggleGuestFlags("waving"),
							},
							<CheckboxWidget>{
								name: widgetProps.photo.id,
								type: "checkbox",
								x: 20,
								y: 198,
								width: 100,
								height: 15,
								text: "Make photos",
								tooltip: "Guests documenting their good time at your park",
								isChecked: widgetProps.photo.toggle,
								onChange: () => this.ToggleGuestFlags("photo"),
							},
							<CheckboxWidget>{
								name: widgetProps.painting.id,
								type: "checkbox",
								x: 150,
								y: 78,
								width: 100,
								height: 15,
								text: "Paint",
								tooltip: "Guests painting happy accidents",
								isChecked: widgetProps.painting.toggle,
								onChange: () => this.ToggleGuestFlags("painting"),
							},
							<CheckboxWidget>{
								name: widgetProps.wow.id,
								type: "checkbox",
								x: 150,
								y: 98,
								width: 100,
								height: 15,
								text: "Wow",
								tooltip: "Guests think they are Owen Wilson",
								isChecked: widgetProps.wow.toggle,
								onChange: () => this.ToggleGuestFlags("wow"),
							},
							<CheckboxWidget>{
								name: widgetProps.hereWeAre.id,
								type: "checkbox",
								x: 150,
								y: 118,
								width: 100,
								height: 15,
								text: "Here we are",
								tooltip: "Guests think they are working for CNN",
								isChecked: widgetProps.hereWeAre.toggle,
								onChange: () => this.ToggleGuestFlags("hereWeAre"),
							},
							<CheckboxWidget>{
								name: widgetProps.iceCream.id,
								type: "checkbox",
								x: 150,
								y: 138,
								width: 100,
								height: 15,
								text: "Ice cream",
								tooltip: "Luitenant Dan, ice cream!",
								isChecked: widgetProps.iceCream.toggle,
								onChange: () => this.ToggleGuestFlags("iceCream")
							},
							<CheckboxWidget>{
								name: widgetProps.pizza.id,
								type: "checkbox",
								x: 150,
								y: 158,
								width: 100,
								height: 15,
								text: "Pizza",
								tooltip: "'A cheese pizza, just for me'",
								isChecked: widgetProps.pizza.toggle,
								onChange: () => this.ToggleGuestFlags("pizza"),
							},
							<CheckboxWidget>{
								name: widgetProps.joy.id,
								type: "checkbox",
								x: 150,
								y: 178,
								width: 100,
								height: 15,
								text: "Joy",
								tooltip: "Press A to jump",
								isChecked: widgetProps.joy.toggle,
								onChange: () => this.ToggleGuestFlags("joy"),
							},
							<CheckboxWidget>{
								name: widgetProps.angry.id,
								type: "checkbox",
								x: 150,
								y: 198,
								width: 100,
								height: 15,
								text: "Angry",
								tooltip: "Turn the guests into Karens",
								isChecked: widgetProps.angry.toggle,
								onChange: () => this.ToggleGuestFlags("angry"),
							},
						]
					},
					{
						image: {
							frameBase: 5245,	// rising graph
							frameCount: 8,
							frameDuration: 4,
						},
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Conditions",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 140,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "Not yet available",
								isDisabled: true
							},
						]
					},
					{
						image: {
							frameBase: 5367,	//rotating info box
							frameCount: 8,
							frameDuration: 4,
						},
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 70,
								text: "About",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 85,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "My first plugin made by me, Manticore-007 \n Built with coaching from Basssiiie \n Based on his Proxy Pather Plugin",
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 140,
								width: 240,
								height: 40,
								text: "GitHub",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 157,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: "centred",
								text: "https://github.com/Manticore-007",
							},
						]
					},
				]
			});
		}
	}
