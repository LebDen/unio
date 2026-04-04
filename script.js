document.addEventListener('DOMContentLoaded', () => {
  // ⏱ Таймер до дропа (по умолчанию +7 дней от текущего)
  const dropDate = new Date();
  dropDate.setDate(dropDate.getDate() + 7); 
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    const diff = dropDate - now;
    if (diff <= 0) {
      document.querySelector('.countdown__label').textContent = '🔥 Дроп активен!';
      return;
    }
    daysEl.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    hoursEl.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    minsEl.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    secsEl.textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 🔍 Фильтры
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const shouldShow = filter === 'all' || filter === card.dataset.category;
        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) {
          card.style.animation = 'fadeIn 0.4s ease-out';
          setTimeout(() => card.style.animation = '', 400);
        }
      });
    });
  });

  // 🔥 Двойной тап / клик по карточке
  let lastTapTime = 0;
  cards.forEach(card => {
    const fireEl = card.querySelector('.fire-count');
    const id = fireEl.dataset.id;
    let count = parseInt(localStorage.getItem(`fire_${id}`) || '0');
    fireEl.textContent = `${count} 🔥`;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn')) return; // Игнорируем клик по кнопке
      const now = Date.now();
      if (now - lastTapTime < 300) {
        count++;
        fireEl.textContent = `${count} 🔥`;
        fireEl.classList.add('fire-pop');
        setTimeout(() => fireEl.classList.remove('fire-pop'), 400);
        localStorage.setItem(`fire_${id}`, count);
      }
      lastTapTime = now;
    });
  });

  // 📦 Quick View Modal
  const modal = document.getElementById('quick-view');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalSizes = document.getElementById('modal-sizes');
  const modalBook = document.getElementById('modal-book');
  const closeModal = document.querySelector('.modal__close');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn')) return;
      modalImg.src = card.dataset.img;
      modalTitle.textContent = card.dataset.name;
      modalPrice.textContent = card.dataset.price;
      modalSizes.textContent = `Размеры: ${card.dataset.sizes}`;
      modalBook.href = `https://t.me/unio_support?text=Привет! Хочу забронировать ${encodeURIComponent(card.dataset.name)}`;
      modal.classList.add('active');
    });
  });

  closeModal.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // 🍔 Мобильное меню
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
  }
});