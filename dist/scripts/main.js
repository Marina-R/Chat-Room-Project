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
	var url = 'https://superamazingchat.herokuapp.com/';
	var chatMsg = _.template($('#messages').html());
	var msgObj = {};
	
	$('#user-login').submit(function(e) {
		e.preventDefault();
		room = $('#select').val();
		user = $('#login-username').val();
		changeRoom(room, user);
	});

	$('textarea').keypress(function(e) {
		if(e.which == 13) {
			msg = $('textarea').val();
			createMsg(user + ':', msg, setTime());
			e.preventDefault();
			$.post(url + 'chat/', {username: user, msg: $('textarea').val(), room: room}, 'json');
			$('textarea').val('');
		}
	});

	$('#enter-msg').submit(function(e) {
		e.preventDefault();
		createMsg(user+':', msg, setTime());
		$.post(url + 'chat/', {username: user, msg: $('textarea').val(), room: room}, 'json');
		$('textarea').val('');

	});

	// $('#go-global').click(changeRoom('global', user));

	function changeRoom (pickARoom, user) {
		myApp.navigate('chat/' + pickARoom, {trigger: true});
		$('#room-name').html(pickARoom);
		$('#msg-output').empty();
		$.post(url + 'new_user', {username: user, room: pickARoom}, 'json'); 
		$.get(url + 'recent', 
			function(data) {
				var users = [];
				for(var i = 0; i<data.length; i++) {
					users.push('<li>' + data[i] + '</li>');
				}
				$('#users').html(users.join(''));
			},
		'json'
		);
		$.get(url + 'most_active_rooms', 
			function(data) {
				var users = [];
				for(var i = 0; i<data.length; i++) {
					users.push('<li><a href="#'+data[i]+'">' + data[i] + '</a></li>');
				}
				$('#active').html(users.join(''));
			},
		'json'
		);
		$.get(url + 'leaderboard', 
			function(data) {
				var users = [];
				for(var i = 0; i<data.length; i++) {
					users.push('<tr><td>'+data[i][0]+'</td>' + '<td class="col-sm-2 col-sm-offset-10">'+ data[i][1] + '</td></tr>');
				}
				$('#leaders').html(users.join(''));
			},
		'json'
		);
		$.get(url + 'chat/'+ pickARoom, 
			function(data) {
				for(var i = 0; i<data.length; i++) {
					createMsg(data[i].username, data[i].msg, moment(data[i].created_at).format('HH:mm:ss'));
				}
			},
		'json'
		);
	};

	// function getMsg () {
		
	// }

	function createMsg (user, msg, time) {
		msgObj.username = user;
		msgObj.msg = msg;
		msgObj.created_at = time;
		var thisMsg = chatMsg(msgObj);
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

})