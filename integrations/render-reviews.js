// Only publish authentic feedback whose public attribution and consent are approved.
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function renderReviews(reviews) {
  const approved = Array.isArray(reviews) ? reviews.filter(review => review?.approved === true && review?.consentToPublish === true && typeof review.name === 'string' && review.name.trim() && typeof review.quote === 'string' && review.quote.trim() && ['membership','private-class'].includes(review.kind)) : [];
  if (!approved.length) return '';
  return `<section class="section reviews-section" id="reviews"><div class="container"><div class="section-heading"><h2>Voices from<br>the learning journey.</h2><p>Experiences shared by learners, in their own words.</p></div><div class="review-grid">${approved.map(review=>`<figure><blockquote><p>“${escape(review.quote)}”</p></blockquote><figcaption><strong>${escape(review.name)}</strong><span>${review.kind==='private-class'?'Private Arabic lessons with Hapi':'Álquimia membership'}</span></figcaption></figure>`).join('')}</div></div></section>`;
}
