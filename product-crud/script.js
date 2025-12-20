document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
  
    const form = document.getElementById('productForm');
    const formTitle = document.getElementById('formTitle');
    const productIdInput = document.getElementById('productId');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const imgInput = document.getElementById('img');
    const cancelBtn = document.getElementById('cancelBtn');
    const productsList = document.getElementById('productsList');
  
    // Загрузка списка товаров
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        renderProducts(products);
      } catch (err) {
        console.error('Ошибка загрузки товаров', err);
        productsList.innerHTML = '<p>Ошибка загрузки</p>';
      }
    }
  
    function renderProducts(products) {
      productsList.innerHTML = '';
      products.forEach(p => {
        const imgPath = p.img ? p.img.split(',')[0] : null;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          ${imgPath ? `<img src="${imgPath}" class="product-img" />` : ''}
          <div class="product-title">${p.title}</div>
          <div class="product-desc">${p.description}</div>
          <div class="product-price">${p.price} ₽</div>
          <div class "product-actions">
            <button class="edit-btn" data-id="${p._id}">Редактировать</button>
            <button class="delete-btn" data-id="${p._id}">Удалить</button>
          </div>
        `;
        productsList.appendChild(card);
      });
  
      // Вешаем обработчики
      document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', () => editProduct(btn.dataset.id))
      );
      document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
      );
    }
  
    // Очистка формы
    function resetForm() {
      form.reset();
      productIdInput.value = '';
      formTitle.textContent = 'Добавить товар';
      cancelBtn.style.display = 'none';
    }
  
    // Сохранение товара
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('title', titleInput.value.trim());
      formData.append('description', descInput.value.trim());
      formData.append('price', priceInput.value);
  
      if (imgInput.files.length > 0) {
        for (let file of imgInput.files) {
          formData.append('img', file);
        }
      }
  
      const isEdit = !!productIdInput.value;
      const url = isEdit ? `${API_URL}/product/update` : `${API_URL}/product`;
      const method = isEdit ? 'PUT' : 'POST';
  
      // Для PUT — отправляем как JSON (твой бэкенд так ожидает в updateProduct)
      let res;
      if (isEdit) {
        const body = {
          _id: productIdInput.value,
          title: titleInput.value.trim(),
          description: descInput.value.trim(),
          price: parseFloat(priceInput.value)
        };
        res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        // POST — multipart/form-data (с файлами)
        res = await fetch(url, {
          method,
          body: formData
        });
      }
  
      if (res.ok) {
        alert(isEdit ? 'Товар обновлён!' : 'Товар добавлен!');
        resetForm();
        loadProducts();
      } else {
        const err = await res.json();
        alert('Ошибка: ' + (err.error || 'Неизвестная ошибка'));
      }
    });
  
    // Редактирование
    async function editProduct(id) {
      try {
        const res = await fetch(`${API_URL}/product/${id}`);
        const product = await res.json();
        if (!product) return;
  
        productIdInput.value = product._id;
        titleInput.value = product.title;
        descInput.value = product.description;
        priceInput.value = product.price;
  
        formTitle.textContent = 'Редактировать товар';
        cancelBtn.style.display = 'inline-block';
        window.scrollTo(0, 0);
      } catch (err) {
        console.error(err);
        alert('Ошибка загрузки товара');
      }
    }
  
    // Удаление
    async function deleteProduct(id) {
      if (!confirm('Удалить товар?')) return;
      try {
        const res = await fetch(`${API_URL}/product/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Товар удалён');
          loadProducts();
        } else {
          alert('Ошибка удаления');
        }
      } catch (err) {
        console.error(err);
        alert('Ошибка сети');
      }
    }
  
    // Отмена редактирования
    cancelBtn.addEventListener('click', resetForm);
  
    // Инициализация
    loadProducts();
  });