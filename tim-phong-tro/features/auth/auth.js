document.addEventListener('DOMContentLoaded', () => {
    // logic dang nhap
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            
            //  email/SĐT
            if (!emailInput.value.trim()) {
                setError(emailInput, 'email-error', 'Vui lòng nhập Email hoặc Số điện thoại.');
                isValid = false;
            } else {
                setSuccess(emailInput, 'email-error');
            }

            //  mật khẩu
            if (!passwordInput.value.trim()) {
                setError(passwordInput, 'password-error', 'Vui lòng nhập mật khẩu.');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                setError(passwordInput, 'password-error', 'Mật khẩu phải có ít nhất 6 ký tự.');
                isValid = false;
            } else {
                setSuccess(passwordInput, 'password-error');
            }

            if (isValid) {
                // dọc danh sách users từ localStorage
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const inputEmail = emailInput.value.trim();
                const inputPassword = passwordInput.value.trim();

                // Kiểm tra xem có tài khoản nào khớp không
                const user = users.find(u => u.email === inputEmail && u.password === inputPassword);

                if (user) {
                    alert('Đăng nhập thành công!');
                    // lưu thông tin người dùng đang đăng nhập 
                    localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
                    window.location.href = '../../index.html'; // chuyển về trang chủ
                } else {
                    setError(passwordInput, 'password-error', 'Email hoặc mật khẩu không chính xác.');
                }
            }
        });
    }

    // logic dăng ksy
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const nameInput = document.getElementById('reg-name');
            const emailInput = document.getElementById('reg-email');
            const passwordInput = document.getElementById('reg-password');
            const confirmPasswordInput = document.getElementById('reg-confirm-password');

            // Tên
            if (!nameInput.value.trim()) {
                setError(nameInput, 'name-error', 'Vui lòng nhập Họ và Tên.');
                isValid = false;
            } else {
                setSuccess(nameInput, 'name-error');
            }

            // Email/SĐT
            if (!emailInput.value.trim()) {
                setError(emailInput, 'email-error', 'Vui lòng nhập Email hoặc SĐT.');
                isValid = false;
            } else {
                setSuccess(emailInput, 'email-error');
            }

            // Mật khẩu
            if (!passwordInput.value.trim()) {
                setError(passwordInput, 'password-error', 'Vui lòng nhập mật khẩu.');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                setError(passwordInput, 'password-error', 'Mật khẩu phải từ 6 ký tự trở lên.');
                isValid = false;
            } else {
                setSuccess(passwordInput, 'password-error');
            }

            //  Nhập lại mật khẩu
            if (!confirmPasswordInput.value.trim()) {
                setError(confirmPasswordInput, 'confirm-password-error', 'Vui lòng xác nhận mật khẩu.');
                isValid = false;
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                setError(confirmPasswordInput, 'confirm-password-error', 'Mật khẩu xác nhận không khớp.');
                isValid = false;
            } else {
                setSuccess(confirmPasswordInput, 'confirm-password-error');
            }

            if (isValid) {
                // lấy danh sách users từ localStorage (hoặc tạo mảng mới)
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                // kiểm tra xem email/sđt đã tồn tại chưa
                const isExist = users.some(u => u.email === emailInput.value.trim());
                if (isExist) {
                    setError(emailInput, 'email-error', 'Email/SĐT này đã được đăng ký.');
                    return;
                }

                // lưu thông tin user mới
                const newUser = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value.trim()
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                alert('Đăng ký thành công! Đang chuyển hướng sang Đăng nhập...');
                window.location.href = 'login.html';
            }
        });
    }

    function setError(inputElement, errorElementId, message) {
        inputElement.classList.add('input-error');
        inputElement.classList.remove('input-success');
        document.getElementById(errorElementId).textContent = message;
    }

    function setSuccess(inputElement, errorElementId) {
        inputElement.classList.remove('input-error');
        inputElement.classList.add('input-success');
        document.getElementById(errorElementId).textContent = '';
    }
});