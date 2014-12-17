var colors = 
["#39dad6", "#c4a299", "#bae745", "#f8ba76", "#65a3a4", "#d168bf", "#372d7d", 
"#a0468b", "#d73a25", "#35fbb4", "#6eefe", "#bae1ae", "#d2e07b", "#5cc71b", 
"#cdd448", "#b9c897", "#9bab2", "#a31481", "#336d2c", "#d2bce6", "#c55c53", 
"#58e58f", "#878da9", "#4b642f", "#66223c", "#33b8a4", "#55192c", "#7c616e", 
"#c58bf0", "#ca3232", "#afd694", "#86fbb9", "#1abf61", "#d77f54", "#3ab4c7", 
"#41225c", "#1ed7cc", "#46bf1d", "#e36af", "#6f316", "#172a34", "#20bfb1", 
"#92375a", "#fa95cb", "#aa4ae2", "#5f2d76", "#9e1ab3", "#e632e1", "#7e9f3e", 
"#a8ed30", "#7ee32a", "#81f936", "#16716a", "#18e9f", "#63434", "#30437f", 
"#9eece4", "#3c21c2", "#6dc8b3", "#4dba7f", "#5ffd9e", "#5aad5c", "#a0b018", 
"#d8d2e0", "#a2c39e", "#5e1e98", "#5466", "#65f55e", "#72a5a7", "#f53982",
"#c0cb21", "#789359", "#9fd84e", "#10a4ad", "#13bd39", "#1aa0c4", "#b12beb", 
"#54ef2", "#659022", "#fb3b55", "#8c6410", "#3052ee", "#fea69e", "#c0c7c6",
"#13174", "#561748", "#5d8b64", "#5ed889", "#8f1de5", "#4b4b27", "#7096ae", 

"#2cdea8", "#c462a2", "#9b3796", "#725cb2", "#7587a6", "#36c2fb", "#871aa7", "#789f9c", "#b520e4"];
function generateColors(){
	for (var i = 0; i < 100; i++) {
		RGBcolor = '#'+(Math.round(Math.random()*256)).toString(16)+(Math.round(Math.random()*256)).toString(16)+(Math.round(Math.random()*256)).toString(16);

		colors.push(RGBcolor);
	};

}