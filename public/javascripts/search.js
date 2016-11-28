
$(function() {

	function objToString (obj) {
    var str = 'Your compatibility percentage with: \n';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ': ' + obj[p] + '%\n';
        }
    }
    return str;
	}

	function objToString2 (obj) {
    var str = '<h2>Your compatibility percentage with: </h2>\n';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += "<h3>" + p + ': ' + obj[p] + '%\n' + "</h3>";
        }
    }
    return str;
	}

	$("#signup_button").click(function(){
	     $.ajax({
	        url: '/search/',
	        type: 'GET',
	        success: function(result) {
	        	console.log("HoLA \n\n");
	        	console.log((JSON.parse(result))[0]);
	        	console.log("HoLA \n\n");
	        	console.log("CLIENT SIDE success! \n");
	        	console.log(result);
	        	// if(result == "Create unsuccessful"){
	        	// 	document.location.href = "/registration.html"
	        	// }
	        	// else{
	        	// 	console.log("IN ELSE!");
	        	// 	document.location.href = "/login.html"
	        	// }
	        	var result2 = (JSON.parse(result));
	        	var result3 = objToString(result2);
	        	var result4 = objToString2(result2);
	        	//alert(result3);
	        	$("#my_panel2").html(result4);
	            
	          }
	        });
	     });

	$("#group_submit2").click(function(){
	     document.location.href = "/group/" + $('#group_id').val();
	 });
});