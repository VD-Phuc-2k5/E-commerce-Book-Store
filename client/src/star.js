export default function star() {
  // Create stars HTML based on rating
  function getStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="bi bi-star-fill"></i> ';
    }

    if (halfStar) {
      starsHTML += '<i class="bi bi-star-half"></i> ';
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="bi bi-star"></i> ';
    }

    return starsHTML;
  }
}
