import './Reviews.css'

const REVIEWS = [
  {
    id: 'r1',
    author: 'Hope Community Kitchen',
    rating: 5,
    body: 'Reliable surplus quality and clear pickup notes. The claim flow is easy for our volunteers.',
    date: 'Sep 2, 2026',
  },
  {
    id: 'r2',
    author: 'City Shelter Network',
    rating: 4,
    body: 'Great donor communication. Would love more evening pickup windows on weekdays.',
    date: 'Aug 28, 2026',
  },
  {
    id: 'r3',
    author: 'Fresh Basket Market',
    rating: 5,
    body: 'Listing surplus takes minutes and our waste logs have dropped noticeably.',
    date: 'Aug 21, 2026',
  },
]

export default function Reviews() {
  return (
    <div className="reviews-page">
      <div className="page reviews-page__inner">
        <header className="fl-section-head reviews-page__head">
          <h2>Reviews</h2>
          <p>Community feedback shell for donors and receivers</p>
        </header>

        <div className="reviews-page__list">
          {REVIEWS.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-card__top">
                <h3>{review.author}</h3>
                <span aria-label={`${review.rating} out of 5`}>
                  {'★'.repeat(review.rating)}
                  <span className="review-card__empty">
                    {'★'.repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
              <p>{review.body}</p>
              <time>{review.date}</time>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
