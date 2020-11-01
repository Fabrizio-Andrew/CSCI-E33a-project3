document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(original) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Write the reply's subject line
  if (original.subject.startsWith('Re:') === false) {
    subjectline = 'Re: ' + original.subject
  } else {
    subjectline = original.subject
  }

  // Propogate reply info into compose form
  document.querySelector('#compose-recipients').value = original.sender;
  document.querySelector('#compose-subject').value = subjectline;
  document.querySelector('#compose-body').value = `\r\n \r\n --Message sent on ${original.timestamp}-- \r\n ${original.body}`;

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

    // Prevent the default redirect to the inbox
    return false;
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
        div.style = 'background-color: lightgray';
      }
      // Open Email when the corresponding hyperlink is clicked
      email_line.onclick = () => read_email(email.id, mailbox);
      
      document.querySelector('#emails-view').append(div);
    });
  });
}

function read_email(email_id, mailbox) {

  // Clear out anything in the read view
  document.querySelector('#read-view').innerHTML = '';

  // Show the "read" view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-view').style.display = 'block';

  // Fetch email from API
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);

    // Reply button
    const reply_button = document.createElement('button');
    reply_button.className = 'btn btn-primary';
    reply_button.innerHTML = 'Reply'
    reply_button.onclick = () => compose_email(email);
    document.querySelector('#read-view').append(reply_button);

    // Archive/Unarchive button
    if (mailbox !== 'sent') {
      const arch_button = document.createElement('button');
      arch_button.className = 'btn btn-primary';
      if (email.archived === true) {
        arch_button.innerHTML = 'Unarchive';
        arch_button.onclick = function () {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: false
            })
          })
          .then(() => load_mailbox('inbox'));
        };
      } else {
        arch_button.innerHTML = 'Archive'
        arch_button.onclick = function () {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: true
            })
          })
          .then(() => load_mailbox('inbox'));
        };
      }
      document.querySelector('#read-view').append(arch_button);
    };

    // Display email info in appropriate divs
    var email_container = document.createElement('div');
    email_container.innerHTML = `<h3>Subject: ${email.subject}
                                <h4>From: ${email.sender}</h4 
                                <p>${email.timestamp}</p>
                                <h4>Message:</h4>
                                <p>${email.body}</p>`;
    document.querySelector('#read-view').append(email_container);
  });

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
  // Prevent the default redirect to the inbox
  return false;
}
