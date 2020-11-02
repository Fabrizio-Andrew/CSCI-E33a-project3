# Read Me

Brief outline of the implementation for each spec:

1. **Send Mail:** When a user submits the email composition form, add JavaScript code to actually send the email.

    - You’ll likely want to make a POST request to /emails, passing in values for recipients, subject, and body.

    - Once the email has been sent, load the user’s sent mailbox.
```
I added this function to the compose-form's onsubmit property.  The function POSTs recipient, subject, and body to the API as a JSON object.  The default functionality to load the inbox is prevented via the "prevent false;" statement.
```

2. **Mailbox:** When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.

    - You’ll likely want to make a GET request to /emails/<mailbox> to request the emails for a particular mailbox.

    - When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.

```
These criteria are supported via lines 77 - 100 under the load_mailbox function.
```

    - When a mailbox is visited, the name of the mailbox should appear at the top of the page (this part is done for you).

    - Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.

```
An <a> element is created for each email containing the specified info and hyperlink.  Each <a> element is appended to its own <div>, which is subsequently appended to the emails-view.

Each <div> is assigned the className "email".  Styling for these divs is managed in styles.css.
```

    - If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.

```
An if statement in load_mailbox checks if the email's read attribute === true.  If so, it sets the background color of the corresponding div to lightgray.
```

3. **View Email:** When a user clicks on an email, the user should be taken to a view where they see the content of that email.

    - You’ll likely want to make a GET request to /emails/<email_id> to request the email.

    - Your application should show the email’s sender, recipients, subject, timestamp, and body.

    - You’ll likely want to add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.

```
The email get request and rendering is fulfilled via the read_email function in inbox.js.
```

    - See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.

```
I actually set the "onclick" attribute to the <a> tags used to display emails in the inbox.  I understand there's a subtle difference between .onlick and an event listener.  I just found this method a little easier in this case.
```

    - Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.

```
This is fulfilled via a PUT request towards the end of read_email.
```

4. **Archive and Unarchive:** Allow users to archive and unarchive emails that they have received.

    - When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
    
    - Recall that you can send a PUT request to /emails/<email_id> to mark an email as archived or unarchived.
    
    - Once an email has been archived or unarchived, load the user’s inbox.

```
This criteria are supported via a two if statements within the read_email condition.  If read_email was called from the 'sent' mailbox, no button displays.  Otherwise, a second if statement determines if the current message is archived or not and sets the Archive/Unarchive button's innerHTML and associated PUT request accordingly.
```

5. **Reply:** Allow users to reply to an email.

    - When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.

    - When the user clicks the “Reply” button, they should be taken to the email composition form.
    
```
The read_email function also renders this reply button with an onclick attribute passing the current email's info back to the compose_email function.
```

    - Pre-fill the composition form with the recipient field set to whoever sent the original email.

    - Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)

    - Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.

```
If the compose_email function is passed an original email, it prefills the recipients line, subject line, and body with the original email's info.  It also checks the original email's subject line to determine if it starts with "Re:".  If not, it adds "Re:" to the beginning of the subject line.
```