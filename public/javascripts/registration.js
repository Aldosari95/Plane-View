
$(function() {

	$("#signup_button").click(function(){
		//"select[data-id='footer']"
		var result = "";
		result += $("#signup_username").val() + '/' + $("#signup_password").val();
		result += '/' + $("#signup_gender1").val() + '/' + $("#signup_gender2").val() + '/' + $("#signup_gender3").val();
		result += '/' + $("#signup_seat1").val() + '/' + $("#signup_seat2").val() + '/' + $("#signup_seat3").val();
		result += '/' + $("#signup_personality1").val() + '/' + $("#signup_personality2").val() + '/' + $("#signup_personality3").val();
		result += '/' + $("#signup_food1").val() + '/' + $("#signup_food2").val() + '/' + $("#signup_food3").val();
	     
	    console.log(result);
	     $.ajax({
	        //url: '/newUser/' + $("#signup_username").val() + '/' + $("#signup_password").val() + '/' + $("#signup_gender").val() + '/' + $("#signup_seat").val() + '/' + $("#signup_personality").val() + '/' + $("#signup_food").val() + '/' + $("#signup_industry").val(),
	        url: '/newUser/' + result,
	        type: 'PUT',
	        success: function(result) {
	        	console.log("CLIENT SIDE success! \n");
	        	console.log(result);
	        	if(result == "Create unsuccessful"){
	        		document.location.href = "/registration.html"
	        	}
	        	else{
	        		console.log("IN ELSE!");
	        		document.location.href = "/search/" + encodeURI($("#signup_username").val());
	        	}
	            
	          }
	        });
	     });

	$("#group_submit2").click(function(){
	     document.location.href = "/group/" + $('#group_id').val();
	 });

	$("#update_summary").click(function(){
	     $("#s_reference").html($("#signup_password").val());
	     $("#s_gender1").html($("#signup_gender1").val());
	     $("#s_gender2").html($("#signup_gender2").val());
	     $("#s_personality1").html($("#signup_personality1").val());
	     $("#s_personality2").html($("#signup_personality2").val());
	     $("#s_seat1").html($("#signup_seat1").val());
	     // $("#s_seat2").html($("#signup_seat2").val());
	     $("#s_food1").html($("#signup_food1").val());
	     $("#s_food2").html($("#signup_food2").val());
	     $("#s_email").html($("#signup_username").val());
	 });
});