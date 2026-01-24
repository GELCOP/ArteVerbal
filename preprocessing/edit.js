const fs = require("fs");
const inquirer = require("inquirer"); // edited the node module for this
const indexObj = JSON.parse(fs.readFileSync("data/index.json", "utf8"));

let filename;
let data;
let storyData;
let storyJsonPath;

let maxArgIndex = 0;

process.argv.forEach(function (val, index, array) {
	maxArgIndex = index;
	if (index === 2) {
		filename = val;
	} else if (index === 3) {
		console.log("Too many arguments. Continuing anyway...");
	}
});

if (maxArgIndex < 2) {
	console.log("To edit the metadata for a file, type: \n node preprocess/edit.js unique_id\n where unique_id is the last part of a story's URL.");
} else {
	try {
		data = indexObj[filename];
		storyJsonPath = `data/json_files/${filename}.json`;
		if (fs.existsSync(storyJsonPath)) {
			storyData = JSON.parse(fs.readFileSync(storyJsonPath, "utf8"));
		} else {
			console.log("⚠️  Story JSON file not found. Tier ID edits will only update the index.");
		}
		main(update);
		console.log("✅" + "  " + "File found! Preparing to edit...");
	} catch (err) {
		console.log("❌" + "  " + " File not found!  \nExiting...");
	}
}

function hasTimestamps(uniqueId) {
	return indexObj[uniqueId].timed === true;
	// if broken, try looking at the actual story...
	// ...
	// let firstSentence = story.sentences[0];
	// return firstSentence.start_time_ms != null;
}

function main(callback) {
	inquirer.prompt([{
			"type": "list",
			"name": "valueToEdit",
			"message": "What do you want to edit?",
			"choices": [
				"audio",
				"video",
				"title",
				"subtitle",
				"description",
				"translation",
				"narration",
			"genre",
			"author",
			"glosser",
			"date recorded",
			"source",
			"tier IDs"
		]
	},
		// mp3
		{
			"type": "input",
			"name": "audio",
			"message": "Name of mp3 file:",
			"default": data["media"]["audio"],
			"when": function (answers) {
				const condition = hasTimestamps(filename) && answers.valueToEdit === "audio";
				return condition;
			},
			"validate": function (response) {
				const media_files = fs.readdirSync("data/media_files");
				if (media_files.indexOf(response) >= 0 || response === "") {
					return true;
				} else if (response === "blank") { // TODO: replace "blank" with "" in then()
					return true;
				} else {
					return "That file doesn't exist in your media_files directory! Please be aware that filenames are case-sensitive and require an extension. Type 'blank' to leave the file blank.";
				}
			}
		},
		// mp4
		{
			"type": "input",
			"name": "video",
			"message": "Name of mp4 file:",
			"default": data["media"]["video"],
			"when": function (answers) {
				const condition = hasTimestamps(filename) && answers.valueToEdit === "audio"
				return condition;
			},
			"validate": function (response) {
				const media_files = fs.readdirSync("data/media_files");
				if (media_files.indexOf(response) >= 0 || response === "") {
					return true;
				} else if (response === "blank") {
					return true;
				} else {
					return "That file doesn't exist in your media_files directory! Please be aware that filenames are case-sensitive and require an extension. Type 'blank' to leave the file blank.";
				}
			}
		},
		// edit title?
		{
			"type": "input",
			"name": "title",
			"message": "Title:",
			"default": data["title"]["_default"],
			"when": function (answers) {
				return answers.valueToEdit === "title"
			}
		},
        // edit subtitle?
        {
            "type": "input",
            "name": "subtitle",
            "message": "Subtitle:",
            "default": data["subtitle"],
            "when": function (answers) {
                return answers.valueToEdit === "subtitle"
            }
        },
        // edit translation?
        {
            "type": "input",
            "name": "translation",
            "message": "Translation:",
            "default": data["translation"],
            "when": function (answers) {
                return answers.valueToEdit === "translation"
            }
        },
		// edit narration?
		{
			"type": "input",
			"name": "narration",
			"message": "Narración:",
			"default": data["narration"],
			"when": function (answers) {
				return answers.valueToEdit === "narration"
			}
		},
		// edit description?
		{
			"type": "confirm",
			"name": "desc_edit",
			"message": "Edit description?",
			"default": false,
			"when": function (answers) {
				if (data["description"] && answers.valueToEdit === "description") {
					console.log("You've already entered a description: " + '"' + data["description"] + '"');
					return true;
				} else {
					return false;
				}
			}
		},
		// description editor (probably using Vim)
		{
			"type": "editor",
			"name": "description",
			"message": " ", // cannot be empty :(
			"default": data["description"],
			"when": function (answers) {
				return (answers["desc_edit"]);
			}
		},
		// description creator
		{
			"type": "input",
			"name": "description",
			"message": "Enter a description:",
			"when": function (answers) {
				return (data["description"] === "" && answers.valueToEdit === "description");
			}
		},
		// genre
		{
			"type": "list",
			"name": "genre",
			"message": "Select a genre:",
			"choices": ["Nonfiction", "Fiction", ""],
			"default": data["genre"],
			"when": function (answers) {
				return answers.valueToEdit === "genre"
			}
		},
		// author
		{
			"type": "input",
			"name": "author",
			"message": "Author:",
			"default": data["author"],
			"when": function (answers) {
				return answers.valueToEdit === "author"
			}
		},
		// glosser
		{
			"type": "input",
			"name": "glosser",
			"message": "Who glossed it:",
			"default": data["glosser"],
			"when": function (answers) {
				return answers.valueToEdit === "glosser"
			}
		},
		// date recorded
		{
			"type": "input",
			"name": "date_created",
			"message": "Date of creation (mm/dd/yyyy):",
			"default": data["date_created"],
			"when": function (answers) {
				return answers.valueToEdit === "date recorded"
			}
		},
		// source
		{
			"type": "input",
			"name": "source",
			"message": "Source:",
			"default": data["source"]["_default"],
			"when": function (answers) {
				return answers.valueToEdit === "source"
			}
		},
		{
			"type": "list",
			"name": "tierAction",
			"message": "Tier ID action:",
			"choices": [
				"Rename tier",
				"Delete tier"
			],
			"when": function (answers) {
				const tierCount = getTierNames().length;
				if (answers.valueToEdit === "tier IDs" && tierCount === 0) {
					console.log("No tier IDs available to edit.");
				}
				return answers.valueToEdit === "tier IDs" && tierCount > 0;
			}
		},
		{
			"type": "list",
			"name": "selectedTier",
			"message": "Select a tier:",
			"choices": function () {
				return getTierNames();
			},
			"when": function (answers) {
				return answers.valueToEdit === "tier IDs" && answers["tierAction"];
			}
		},
		{
			"type": "input",
			"name": "newTierName",
			"message": "New tier name:",
			"default": function (answers) {
				return answers["selectedTier"] || "";
			},
			"when": function (answers) {
				return answers.valueToEdit === "tier IDs" && answers["tierAction"] === "Rename tier" && Boolean(answers["selectedTier"]);
			},
			"validate": function (response, answers) {
				if (!response || response.trim() === "") {
					return "Tier name cannot be empty.";
				}
				if (response === answers["selectedTier"]) {
					return "Please enter a different tier name.";
				}
				if (tierExists(response)) {
					return "A tier with that name already exists.";
				}
				return true;
			},
			"filter": function (response) {
				return response.trim();
			}
		},
		{
			"type": "confirm",
			"name": "confirmTierDelete",
			"message": function (answers) {
				return `Delete tier "${answers["selectedTier"]}"? This cannot be undone.`;
			},
			"default": false,
			"when": function (answers) {
				return answers.valueToEdit === "tier IDs" && answers["tierAction"] === "Delete tier" && Boolean(answers["selectedTier"]);
			}
		}
	]).then(function (answers) {
		if (answers["audio"] && answers["audio"] == "blank") {
			data["media"]["audio"] == "";
		} else if (answers["audio"]) {
			data["media"]["audio"] = answers["audio"];
		}
		if (answers["video"] && answers["video"] == "blank") {
			data["media"]["video"] == "";
		} else if (answers["video"]) {
			data["media"]["video"] = answers["video"];
		}
		data["timed"] = (data["media"]["audio"] != "") || (data["media"]["video"] != "");

		if (answers["description"]) {
			data["description"] = answers["description"];
		}

		if (answers["title"]) {
			data["title"]["_default"] = answers["title"]
		}
        if (answers["subtitle"]) {
            data["subtitle"] = answers["subtitle"]
        }
        if (answers["translation"]) {
            data["translation"] = answers["translation"];
        }
		if (answers["narration"]) {
			data["narration"] = answers["narration"];
		}

		if (answers["genre"]) {
			data["genre"] = answers["genre"]
		}

		if (answers["author"]) {
			data["author"] = answers["author"]
		}

		if (answers["glosser"]) {
			data["glosser"] = answers["glosser"]
		}

		if (answers["date_created"]) {
			data["date_created"] = answers["date_created"]
		}

		if (answers["source"]) {
			data["source"]["_default"] = answers["source"]
		}

		if (answers["tierAction"] === "Rename tier" && answers["selectedTier"] && answers["newTierName"]) {
			renameTier(answers["selectedTier"], answers["newTierName"]);
		}

		if (answers["tierAction"] === "Delete tier" && answers["selectedTier"] && answers["confirmTierDelete"]) {
			deleteTier(answers["selectedTier"]);
		} else if (answers["tierAction"] === "Delete tier" && answers["selectedTier"] && !answers["confirmTierDelete"]) {
			console.log("Tier deletion cancelled.");
		}

		callback()
	})
}

function getTierNames() {
	if (storyData && storyData.metadata && storyData.metadata["tier IDs"]) {
		return Object.keys(storyData.metadata["tier IDs"]);
	}
	if (data && data["tier IDs"]) {
		return Object.keys(data["tier IDs"]);
	}
	return [];
}

function tierExists(name) {
	if (!name) {
		return false;
	}
	const tierSources = [];
	if (storyData && storyData.metadata && storyData.metadata["tier IDs"]) {
		tierSources.push(storyData.metadata["tier IDs"]);
	}
	if (data && data["tier IDs"]) {
		tierSources.push(data["tier IDs"]);
	}
	return tierSources.some((tierIDs) => Object.prototype.hasOwnProperty.call(tierIDs, name));
}

function renameTier(oldName, newName) {
	if (!oldName || !newName || oldName === newName) {
		return;
	}

	if (!data["tier IDs"]) {
		data["tier IDs"] = {};
	}

	if (data["tier IDs"][oldName]) {
		data["tier IDs"][newName] = data["tier IDs"][oldName];
		delete data["tier IDs"][oldName];
	}

	if (!storyData) {
		console.log("⚠️  Story JSON file missing; only index metadata updated.");
		return;
	}

	if (storyData.metadata && storyData.metadata["tier IDs"] && storyData.metadata["tier IDs"][oldName]) {
		storyData.metadata["tier IDs"][newName] = storyData.metadata["tier IDs"][oldName];
		delete storyData.metadata["tier IDs"][oldName];
	}

	if (storyData.metadata && storyData.metadata["speaker IDs"]) {
		for (const speakerID of Object.keys(storyData.metadata["speaker IDs"])) {
			const speaker = storyData.metadata["speaker IDs"][speakerID];
			if (speaker["tier"] === oldName) {
				speaker["tier"] = newName;
			}
		}
	}

	if (storyData.sentences && Array.isArray(storyData.sentences)) {
		for (const sentence of storyData.sentences) {
			if (sentence["tier"] === oldName) {
				sentence["tier"] = newName;
			}
			if (Array.isArray(sentence["dependents"])) {
				for (const dep of sentence["dependents"]) {
					if (dep["tier"] === oldName) {
						dep["tier"] = newName;
					}
				}
			}
		}
	}
}

function deleteTier(tierName) {
	if (!tierName) {
		return;
	}

	if (data["tier IDs"] && data["tier IDs"][tierName]) {
		delete data["tier IDs"][tierName];
	}

	if (!storyData) {
		console.log("⚠️  Story JSON file missing; tier deleted from index metadata only.");
		return;
	}

	if (storyData.metadata && storyData.metadata["tier IDs"] && storyData.metadata["tier IDs"][tierName]) {
		delete storyData.metadata["tier IDs"][tierName];
	}

	if (storyData.metadata && storyData.metadata["speaker IDs"]) {
		for (const speakerID of Object.keys(storyData.metadata["speaker IDs"])) {
			const speaker = storyData.metadata["speaker IDs"][speakerID];
			if (speaker["tier"] === tierName) {
				delete storyData.metadata["speaker IDs"][speakerID];
			}
		}
	}

	if (storyData.sentences && Array.isArray(storyData.sentences)) {
		for (const sentence of storyData.sentences) {
			if (sentence["tier"] === tierName) {
				delete sentence["tier"];
			}
			if (Array.isArray(sentence["dependents"])) {
				sentence["dependents"] = sentence["dependents"].filter((dep) => dep["tier"] !== tierName);
			}
		}
	}
}

function update() {
	fs.writeFileSync("data/index.json", JSON.stringify(indexObj, null, 2));
	if (storyData && storyJsonPath) {
		fs.writeFileSync(storyJsonPath, JSON.stringify(storyData, null, 2));
	}
	console.log("📤" + "  " + "Metadata edit complete.");
	console.log("\nYou've successfully edited the metadata. However, this will not be displayed on the site until you rebuild the databases and site. (You can do both using the \"quick-build-online\" or \"quick-build-offline\" npm script; for more info: https://github.com/BrownCLPS/LingView/wiki)");
}
