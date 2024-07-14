document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const logoutButton = document.getElementById('logoutButton');

// Configura o evento de submissão do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            authenticateUser(username, password);
        });
    }

    // Configura o evento de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // Carrega dados no dashboard, se a página for o dashboard
    if (window.location.pathname.endsWith('dashboard.html')) {
        displayDashboardData();
    }

    // Configura a submissão do formulário de recursos e carrega a lista de recursos, se a página for de recursos
    if (window.location.pathname.endsWith('resources.html')) {
        const resourceForm = document.getElementById('resourceForm');
        resourceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addResource();
        });

        displayResources();
    }
});

function authenticateUser(username, password) {
    const users = [
        { username: 'funcionario', password: '1234', role: 'funcionario' },
        { username: 'gerente', password: '1234', role: 'gerente' },
        { username: 'admin', password: '1234', role: 'admin' },
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        errorMessage.textContent = 'Usuário ou senha inválidos';
    }
}

function displayDashboardData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const securityData = document.getElementById('securityData');
    const resourceData = document.getElementById('resourceData');

    securityData.innerHTML = `<h2>Bem-vindo, ${user.username}</h2>`;
    if (user.role === 'admin' || user.role === 'gerente') {
        resourceData.innerHTML = `<p><a href="resources.html">Gerenciar Recursos</a></p>`;
        
    }
    
    

}

function addResource() {
    const resourceName = document.getElementById('resourceName').value;
    const resourceType = document.getElementById('resourceType').value;
    const resourceQuantity = document.getElementById('resourceQuantity').value;

    const resources = JSON.parse(localStorage.getItem('resources')) || [];
    resources.push({ name: resourceName, type: resourceType, quantity: resourceQuantity });
    localStorage.setItem('resources', JSON.stringify(resources));

    displayResources();
    document.getElementById('resourceForm').reset();
}

function displayResources() {
    const resources = JSON.parse(localStorage.getItem('resources')) || [];
    const resourceList = document.getElementById('resourceList');

    resourceList.innerHTML = resources.map(resource => `
        <div>
            <h3>${resource.name}</h3>
            <p>Tipo: ${resource.type}</p>
            <p>Quantidade: ${resource.quantity}</p>
            <button onclick="removeResource('${resource.name}')">Remover</button>
        </div>
    `).join('');
}

function removeResource(resourceName) {
    let resources = JSON.parse(localStorage.getItem('resources')) || [];
    resources = resources.filter(resource => resource.name !== resourceName);
    localStorage.setItem('resources', JSON.stringify(resources));

    displayResources();
}
