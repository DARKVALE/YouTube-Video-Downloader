const supportForm = document.querySelector('[data-support-form]');
const conciergeForm = document.querySelector('[data-concierge-form]');
const trackingForm = document.querySelector('[data-tracking-form]');
const trackingFeedback = document.querySelector('[data-tracking-feedback]');
const trackingStatusState = document.querySelector('.tracking-status__state');
const trackingEventsList = document.querySelector('[data-tracking-events]');

function showTemporaryMessage(target, message) {
  if (!target) return;
  target.textContent = message;
  target.hidden = false;
  window.setTimeout(() => {
    if (target) {
      target.hidden = true;
      target.textContent = '';
    }
  }, 4000);
}

function handleSupportSubmit(event) {
  event.preventDefault();
  const feedback = event.currentTarget.querySelector('[data-support-feedback]');
  showTemporaryMessage(feedback, 'Thanks! Our care team will reply within a few hours.');
  event.currentTarget.reset();
}

function handleConciergeSubmit(event) {
  event.preventDefault();
  const feedback = event.currentTarget.querySelector('[data-concierge-feedback]');
  showTemporaryMessage(feedback, 'Your concierge consultation is booked. Expect a follow-up within 1 business day.');
  event.currentTarget.reset();
}

function renderTrackingTimeline(orderId) {
  if (!trackingEventsList || !trackingStatusState) return;
  const events = [
    { label: 'Order confirmed', time: 'Today · 8:14 AM' },
    { label: 'Packed at Nebula Fulfilment · San Francisco', time: 'Today · 12:47 PM' },
    { label: 'Departed distribution hub', time: 'Today · 4:32 PM' },
    { label: 'Estimated delivery', time: 'In 2 days' }
  ];
  trackingStatusState.textContent = `Tracking update for ${orderId}`;
  trackingEventsList.innerHTML = events.map((event) => `<li><strong>${event.label}</strong><br /><span>${event.time}</span></li>`).join('');
}

function handleTrackingSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const order = formData.get('order');
  const email = formData.get('email');
  if (!order || !email) {
    showTemporaryMessage(trackingFeedback, 'Please enter a valid order number and email.');
    return;
  }
  renderTrackingTimeline(order);
  showTemporaryMessage(trackingFeedback, 'Live tracking updated. Watch for delivery notifications by email.');
  event.currentTarget.reset();
}

function initSupport() {
  supportForm?.addEventListener('submit', handleSupportSubmit);
  conciergeForm?.addEventListener('submit', handleConciergeSubmit);
  trackingForm?.addEventListener('submit', handleTrackingSubmit);
}

initSupport();
