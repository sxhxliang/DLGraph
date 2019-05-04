const GraphConfig = {

	CANVAS_GRID_SIZE: 10,
	
	NODE_TITLE_HEIGHT: 20,
	NODE_SLOT_HEIGHT: 15,
	NODE_WIDGET_HEIGHT: 20,
	NODE_WIDTH: 140,
	NODE_MIN_WIDTH: 50,
	NODE_COLLAPSED_RADIUS: 10,
	NODE_COLLAPSED_WIDTH: 80,
	NODE_TITLE_COLOR: "#999",
	NODE_TEXT_SIZE: 14,
	NODE_TEXT_COLOR: "#AAA",
	NODE_SUBTEXT_SIZE: 12,
	NODE_DEFAULT_COLOR: "#333",
	NODE_DEFAULT_BGCOLOR: "#444",
	NODE_DEFAULT_BOXCOLOR: "#666",
	NODE_DEFAULT_SHAPE: "box",
	DEFAULT_SHADOW_COLOR: "rgba(0,0,0,0.5)",
	DEFAULT_GROUP_FONT: 24,

	LINK_COLOR: "#AAD",
	EVENT_LINK_COLOR: "#F85",
	CONNECTING_LINK_COLOR: "#AFA",

	MAX_NUMBER_OF_NODES: 1000, //avoid infinite loops
	DEFAULT_POSITION: [100,100],//default node position
	VALID_SHAPES: ["default","box","round","card","circle"], //,"circle"

	//shapes are used for nodes but also for slots
	BOX_SHAPE: 1,
	ROUND_SHAPE: 2,
	CIRCLE_SHAPE: 3,
	CARD_SHAPE: 4,
	ARROW_SHAPE: 5,

	//enums
	INPUT: 1,
	OUTPUT: 2,

	EVENT: -1, //for outputs
	ACTION: -1, //for inputs

	ALWAYS: 0,
	ON_EVENT: 1,
	NEVER: 2,
	ON_TRIGGER: 3,

	UP: 1,
	DOWN:2,
	LEFT:3,
	RIGHT:4,
	CENTER:5,

	NORMAL_TITLE: 0,
	NO_TITLE: 1,
	TRANSPARENT_TITLE: 2,
	AUTOHIDE_TITLE: 3,

	proxy: null, //used to redirect calls
	node_images_path: "",

	debug: false,
	catch_exceptions: true,
	throw_errors: true,
	allow_scripts: false,
	registered_node_types: {}, //nodetypes by string
	node_types_by_file_extension: {}, //used for droping files in the canvas
	Nodes: {}, //node types by classname

    searchbox_extras: {}, //used to add extra features to the search box
    
}

export {GraphConfig}
