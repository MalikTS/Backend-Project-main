document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const signUpLink = document.getElementById('signUpLink');
    const signInLink = document.getElementById('signInLink');
  
    // Переключение между формами
    signUpLink.addEventListener('click', e => {
      e.preventDefault();
      container.classList.add('show-sign-up');
      container.classList.remove('show-sign-in');
    });
  
    signInLink.addEventListener('click', e => {
      e.preventDefault();
      container.classList.add('show-sign-in');
      container.classList.remove('show-sign-up');
    });
  
    // === Регистрация ===
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const username = document.getElementById('regUsername').value;
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const avatarFile = document.getElementById('regAvatar').files[0];
  
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (avatarFile) formData.append('avatar', avatarFile);
  
      try {
        const res = await fetch('http://localhost:5000/auth/registration', {
          method: 'POST',
          body: formData, // multipart/form-data — удобно для файлов
        });
  
        const data = await res.json();
        if (res.ok) {
          alert('Регистрация успешна! Теперь войдите.');
          // Переключаем на форму входа
          container.classList.add('show-sign-in');
          container.classList.remove('show-sign-up');
        } else {
          alert('Ошибка регистрации: ' + (data.message || 'Неизвестная ошибка'));
        }
      } catch (err) {
        console.error(err);
        alert('Ошибка сети. Убедитесь, что бэкенд запущен.');
      }
    });
  
    // === Вход ===
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
  
      try {
        const res = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await res.json();
        if (res.ok) {
          alert('Вход выполнен!');
          // Здесь можно сохранить токен (например, в localStorage) и перейти в личный кабинет
          localStorage.setItem('authToken', data.token); // если твой бэкенд возвращает токен
          // Например: window.location.href = '/dashboard.html';
        } else {
          alert('Ошибка входа: ' + (data.message || 'Неверные данные'));
        }
      } catch (err) {
        console.error(err);
        alert('Ошибка сети. Убедитесь, что бэкенд запущен.');
      }
    });
  
    // Изначально показываем форму входа
    container.classList.add('show-sign-in');
  });