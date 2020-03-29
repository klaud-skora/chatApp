const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

const socket = io();
socket.on('message', ({author, content}) => addMessage(author, content));

function login(e) {
  e.preventDefault();
  if(userNameInput.value == '') {
    return alert('Type name to log in.');
  }
  userName = userNameInput.value;
  loginForm.classList.remove('show');
  messagesSection.classList.add('show');
  socket.emit('login', userName);
}

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  
  if(author === userName) {
    message.classList.add('message--self');
  } else if(author === 'Chat Bot') {
    message.classList.add('message--bot');
  }

  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  messagesList.appendChild(message);
}

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;
  if(messageContent == '') {
    return alert('Error: Message is empty.');
  }

  addMessage(userName, messageContent);
  socket.emit('message', {author: userName, content: messageContent});
  messageContentInput.value = '';
}

/* Action listeners */
loginForm.addEventListener('submit', function(e) {
  login(e);
});

addMessageForm.addEventListener('submit', function(e) {
  sendMessage(e);
})

