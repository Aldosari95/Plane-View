
$(function() {

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

	        	alert(result);
	            
	          }
	        });
	     });

	$("#group_submit2").click(function(){
	     document.location.href = "/group/" + $('#group_id').val();
	 });

	$("#feedback_submit").click(function(){
		alert("Thank you for your feedback!");
	    document.location.href = "/";
	 });
});