# Chat Room Project

###Objectives
* Learned about the core principles of Agile development.
* Learned how to use github issues for managing a project.
* Learned about markdown for writing documentation.

###Project features
1. Users are be able to set a username and post messages to chat.
2. Any user who is in that chat room can see all messages that are posted along with the username of the person who posted them and the date and time they were posted.
3. Users are able to change their name and have the new name show up in future messages. Old messages keep the old username.
4. Messages appear on the page without having to refresh the page.
5. When a user enters a chat room, it only shows the last five minutes of messages (not the whole chat history). The five minute window is configurable.
6. There is a leaderboard page that displays the following information:
- Top ten usernames ranked by the number of total messages that they posted.
- Most active chat rooms ranked by the number of messages posted in that room.
- A list of users who have posted a message in the last four hours. 
7. Supports emoticons.
8. Supports multiple chat rooms. 
9. Plays a sound anytime a new chat is posted into your chat room.
10. A swear word filter. Keepa things PG. No four letter words are be printed into the chat room. Instead displays '****'
11. Created a chat bot that automatically responds to certain messages with responses. For example, if a user types in "amiright" the chat bot would automatically respond with "you are so right!"
12. Added a profile page to show all messages for a particular user.

###ToDo
- If a link to a gif, jpg, or png image url is posted into chat, show that image in addition to the link.
- Play a sound only if a message is posted in the chat room that includes @
- Be able to view the history of a chat room by specifying a start and end date. (like: http://localhost:3000/room/foo/1-27-14/1-29-14)
