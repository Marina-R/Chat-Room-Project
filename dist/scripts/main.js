$(document).ready(function() {

	var App = Backbone.Router.extend({
		routes: {
			'': 'main',
			'welcome': 'main',
			'chat': 'global',
			'chat/:room': 'toRoom',
			'*notfound': 'global'
		},
		main: function() {
			$('section').hide();
			$('#welcome').show();	
		},
		global: function() {
			$('section').hide();
			$('#chat').show();
		},
		toRoom: function(newRoom) {
			$('section').hide();
			$('.'+newRoom).show();
			room = newRoom;
		}
	});
	var myApp = new App();
	Backbone.history.start();

	var user = '';
	var room = '';
	var msg = '';
	var id = '';
	
	var url = 'https://superamazingchat.herokuapp.com/';
	var chatMsg = _.template($('#messages').html());
	var msgObj = {};
	var msgArray = [];
	
	$('#user-login').submit(function(e) {
		e.preventDefault();
		room = $('#select').val();
		user = $('#login-username').val();
		changeRoom(room, user);
	});

	$('textarea').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			msg = $('textarea').val();
			$.post(url + 'chat/', {username: user, msg: msg, room: room}, 'json');
			setTimeout(getMsg, 500);
			$('textarea').val('');
		}
	});

	$('#enter-msg').submit(function(e) {
		e.preventDefault();
		$.post(url + 'chat/', {username: user, msg: $('textarea').val(), room: room}, 'json');
		setTimeout(getMsg, 500);
		$('textarea').val('');
	});

	$('#settings').click(function() {
		$('#chat').css('opacity', '0.7');
		$('#set').css('display', 'block');

		$('#changeNameBtn').click(function() {
			user = $('#changeName').val();
			changeRoom(room, user);
			$('#chat').css('opacity', '1');
			$('#set').css('display', 'none');
			
		});
	});

	$('#go-global').click(function (){
		changeRoom('Global', user);
		setInterval(getMsg, 1000);
	});
	$('#go-private').click(function (){
		changeRoom('Private', user);
		setInterval(getMsg, 1000);
	});
	$('#go-unicorns').click(function (){
		changeRoom('No-unicorns-allowed', user);
		setInterval(getMsg, 1000);
	});
	$('#go-extreme').click(function (){
		changeRoom('Extreme-programming', user);
		setInterval(getMsg, 1000);
	});
	$('#go-waterfalls').click(function (){
		changeRoom('Waterfalls-are-pretty', user);
		setInterval(getMsg, 1000);
	});

	function changeRoom (thisRoom, user) {
		console.log(thisRoom);
		myApp.navigate('chat/' + thisRoom, {trigger: true});
		$('#room-name').html(thisRoom);
		// $('#msg-output').empty();
		$.post(url + 'new_user', {username: user, room: thisRoom}, 'json'); 
		$.get(url + 'recent', 
			function(data) {
				var users = [];
				for(var i = 0; i<data.length; i++) {
					users.push(data[i] + '<br>');
				}
				$('#users').html(users.join(''));
			},
		'json'
		);
		$.get(url + 'most_active_rooms', 
			function(data) {
				var users = [];
				for(var i = 0; i<data.length; i++) {
					users.push('<a href="#'+data[i]+'">' + data[i] + '</a><br>');
				}
				$('#active').html(users.join(''));
			},
		'json'
		);
		$.get(url + 'leaderboard', 
			function(data) {
				var users = [];
				for(var i = 0; i<data.length; i++) {
					users.push('<tr><td>'+data[i][0]+'</td>' + '<td>'+ data[i][1] + '</td></tr>');
				}
				$('#table').html(users.join(''));
			},
		'json'
		);
		setTimeout(getMsg, 1000);
		
	};

	function checkMsg (msgArray, data) {
		var present = false;
		for(var j = 0; j < msgArray.length; j++) {
			if(msgArray[j].id == data.id) {
				present = true;
				break;
			
			} else {
				msgArray.push(data);
			}
		}
		return present;
	}
 	var lastMsgId = 0;

	function getMsg() {
		return ($.get(url + 'chat/'+ room, 
			function(data) {
				for(var i = 0; i < data.length; i++) {
					if(data[i].id > lastMsgId) {
						createMsg(data[i].username, data[i].msg, moment(data[i].created_at).format('HH:mm:ss'), data[i].id);
						lastMsgId = data[i].id;
					}
				}
			},
		'json'
		));
	};

	function createMsg (user, msg, time, id) {
		msgObj.username = user;
		msgObj.msg = msg;
		msgObj.created_at = time;
		msgObj.id = id;
		var thisMsg = chatMsg(msgObj);
		msgArray.push(msgObj);
		$('#msg-output').append(thisMsg);
	
	};
	function setTime() {
		var date = new Date();
		var hh = date.getHours();
		var mm = date.getMinutes();
		var ss = date.getSeconds();
		if(hh < 10) {
			hh = '0' + hh;
		} 
		if(mm < 10) {
			mm = '0' + mm;
		}
		if(ss < 10) {
			ss = '0' + ss;
		}
		return (hh + ':' + mm + ':' + ss);
	};

	setInterval(getMsg, 1000);
})