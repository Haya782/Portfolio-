const email = contactDetails.email.trim();
if (email) {
  document.querySelectorAll('[data-email]').forEach(link => link.href = 'mailto:' + email + '?subject=Website%20enquiry');
  document.querySelectorAll('[data-address]').forEach(el => el.textContent = email);
  document.querySelectorAll('[data-contact-note]').forEach(el => el.hidden = true);
}
const linkedin = document.querySelector('[data-linkedin]');
if (linkedin && /^https:\/\/(www\.)?linkedin\.com\//i.test(contactDetails.linkedin)) {
  linkedin.href = contactDetails.linkedin;
  linkedin.hidden = false;
}
