// JD: 13
var generateList = function(){ // JD: 12
	$.getJSON(
	    "http://lmu-diabolical.appspot.com/characters",
	    function (characters) {
	        $("tbody").append(characters.map(function (character) {
	            return $("<tr></tr>")
	                .append($("<td></td>").text(character.name))
	                .append($("<td></td>").text(character.classType))
	                .append($("<td></td>").text(character.gender))
	                .append($("<td></td>").text(character.level))
	                .append($("<td></td>").text(character.money))
	                .append($("<td></td>").append("<input type='button' class='btn btn-primary editor' value='edit'></input>"));
	        }));
	        $(".boxed").removeAttr("hidden");
	        $(".features").removeAttr("hidden");
	        $("#play").hide();
	    }
	);
}

var addCharacter = function(){ // JD: 12
	var charName = $(".charName").val();
	var charClass = $(".charClass").val();
	var gender = $(".gender").val();
	var level = parseInt($(".level").val());
	var money = parseInt($(".money").val());

	$.ajax({
        // JD: 14 ...from here on down.
   type: 'POST',
    url: "http://lmu-diabolical.appspot.com/characters",
    data: JSON.stringify({
        name: charName,
       classType: charClass,
        gender: gender,
        level: level,
        money: money
   }),
    contentType: "application/json",
    dataType: "json",
    accept: "application/json",
   complete: function (jqXHR, textStatus) { // JD: 1
        // The new character can be accessed from the Location header.
        console.log("You may access the new character at:" +
            jqXHR.getResponseHeader("Location"));
    }
});
}