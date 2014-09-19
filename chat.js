/**
 * @author steve bock
 *
 */
/*function getRooms() { http://localhost:5984/chat/_design/chatRoom/_view/room_names?group_level=1
 $.getJSON("http://127.0.0.1:5984/chat/_design/chatRoom/_view/room_names?group_level=1", function(data) {
 console.dir(data);
 });
 };*/
$(function() {
	var dbUrl = "http://162.243.200.233:5984/chat", lastSeq = 1, name, room, chatInterval;
	$("#pickRoom").click(function() {
		$("#roomMenu").empty();
		$.getJSON(dbUrl+"/_design/chatRoom/_view/room_names?group_level=1", function(data) {
			console.dir(data);
			$.each(data.rows, function(index, value) {
				var rListItem = $("<li><a href='#'>" + value.key + "</a></li>").click(function() {
					room = value.key;
					if (name && room) {
						$("#chatPage").css('display', 'block');
						if(chatInterval){
							lastSeq=0;
							$("#textArea1").empty();
						}else{
							runGetChats();
						}
						
					} else {
						alert("you need to register first");
					}
				});
				$("#roomMenu").append(rListItem);
			});
		});
	});
	//$("#welcomePicture").modal('hide');
	$("#roomSubmit").click(function() {
		if ($("#roomInput").val()) {
			room = $("#roomInput").val();
			if (name) {
						runGetChats();
						$("#chatPage").css('display', 'block');
					} else {
						alert("you need to register first");
					}
		}
	});

	$(".sendButton").click(function() {
		var textInput = $("#textInput"), task;
		if (!name) {
			alert("please enter a name");
		} else if (textInput.val()) {
			task = textInput.val();
			textInput.val("");
			$.ajax({
				type : "POST",
				url : dbUrl,
				data : JSON.stringify({
					"item" : task,
					name : name,
					room : room
				}),
				contentType : "application/json",
				dataType : "json",
				success : function(data) {
					//addTask(task, data.id, data.rev);
					console.log(data);
				}
			});
		}
	});

	$("#nameButton").click(function() {
		name = $("#nameField").val();
		$("#nameField").val("");
		if (!name) {
			alert("you need to enter a name");
		}
	});
	$("#home").click(function(){
		$("#chatPage").css('display', 'none');
	});

	function getChats() {
		$.ajax({
			type : "GET",
			url : dbUrl + "/_changes?filter=/chatRoom/room_choser&room=" + room + "&include_docs=true&since=" + lastSeq,
			//data : '{"item":' + JSON.stringify(task) + '}',
			contentType : "application/json",
			dataType : "json",
			success : function(data) {
				lastSeq = data.last_seq;
				data.results.forEach(function(row) {
					$("#textArea1").prepend("&nbsp" + row.doc.room + ":" + "&nbsp" + row.doc.name + ":" + "&nbsp" + row.doc.item + "<br>");
				});

				//$("#chatOutPut").append("&nbsp" + "&nbsp" + theData.doc.item + "<br>");
			}
		});
	};
	function runGetChats() {
		chatInterval = setInterval(function() {
			getChats();
		}, 800);
	};

	$("#clear").click(function() {
		$("#chatOutPut").empty();
	});
});




