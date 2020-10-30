document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Send email when form is submitted
  document.querySelector('#compose-form').onsubmit = function() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);

    load_mailbox('sent');
    });
  }
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch emails for mailbox from API
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Create div with info for each email in response
    emails.forEach(function(email) { 
      var div = document.createElement('div');
      var email_line = document.createElement('a');
      email_line.class = 'email-line';
      email_line.href = '';
      email_line.innerHTML = `${email.subject} -- ${email.sender} -- ${email.timestamp}`;
      div.append(email_line);
      if (email.read === true) {
        div.style = 'background-color: gray';
      }
      email_line.addEventListener('click', () => read_email(`${email.id}`))
      document.querySelector('#emails-view').append(div);
    });
  });
}

function read_email(email) {

  // Show the "read" view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-view').style.display = 'block';

  // Fetch email from API
  fetch(`/emails/${email}`)
  .then(response => response.json())
  .then(email => {
    // Display email info in appropriate divs
    // THIS IS STILL REDIRECTING TO INBOX!!!
    console.log(email);
    const div = document.createElement('div');
    div.innerHTML = `${email.subject} -- ${email.sender} -- ${email.timestamp}`;
    const body = document.createElement('div');
    body.innerHtml = `${email.body}`
    document.querySelector('#read-view').append(div, body)
  });
}