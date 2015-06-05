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
		toRoom: function(room) {
			$('section').hide();
			var room = $('#select').val();
			console.log(room);
			$('.'+room).show();
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
		myApp.navigate('chat/'+room, {trigger: true});
		$('#room-name').html(room);
		$('#msg-output').empty();
		$.post(url+'new_user', {username: user, room: room}, 'json');
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
		$.get(url + 'chat/'+ room, 
			function(data) {
				for(var i = 0; i<data.length; i++) {
					createMsg(data[i].username, data[i].msg, moment(data[i].created_at).format('HH:mm:ss'));
				}
			},
		'json'
		);

	});

	$('textarea').keypress(function(e) {
		if(e.which == 13) {
			msg = $('textarea').val();
			createMsg(user+':', msg, setTime());
			e.preventDefault();
			$.post(url + 'chat', {username: user, msg: $('textarea').val()}, 'json');
			$('textarea').val('');
		}
	});

	$('#enter-msg').submit(function(e) {
		e.preventDefault();
		createMsg(user+':', msg, setTime());
		$.post(url + 'chat', {username: user, msg: $('textarea').val()}, 'json');
		$('textarea').val('');

	});

	$('')

	function createMsg (user, msg, time) {
		msgObj.username = user;
		msgObj.msg = msg;
		msgObj.created_at = time;
		var msg = chatMsg(msgObj);
		$('#msg-output').append(msg);
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