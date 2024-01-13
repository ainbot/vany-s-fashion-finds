// Referências aos nós no banco de dados Firebase
const produtosRef = firebase.database().ref('produtos');
const camisasRef = firebase.database().ref('camisas');
const calcasRef = firebase.database().ref('calcas');
const bolsasRef = firebase.database().ref('bolsas');
const sapatosRef = firebase.database().ref('sapatos');
const linkRef = firebase.database().ref('link/link');

// Recupere o link do Firebase quando a página carregar
linkRef.once('value')
  .then(snapshot => {
    const externalLink = snapshot.val().link;

    // Adicione click event listener à imagem de contato
    const whatsappIcon = document.getElementById('whatsappIcon');
    whatsappIcon.addEventListener('click', () => {
      // Abra o link externo em uma nova guia
      window.open(externalLink, '_blank');
    });
  })
  .catch(error => {
    console.error("Erro ao recuperar o link externo do Firebase:", error);
  });

    // Defina uma variável para rastrear a página atual
    let currentPage = 1;

    // Defina o número de produtos por página
    const productsPerPage = 8;

    // Array para armazenar os produtos carregados do Firebase
    let allProducts = [];

    // Adicione uma variável global para armazenar a categoria selecionada
    let selectedCategory = '';

    // Variáveis para rastrear as imagens na modal
    let currentImageIndex = 0;
    let images = [];

    // Função para exibir produtos com base na página atual
    function showProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentProducts = allProducts.slice(startIndex, endIndex);

        // Lógica para exibir os produtos ou mensagem de estoque esgotado
        const main = document.getElementById('main');
        main.innerHTML = '';

        if (currentProducts.length > 0) {
            currentProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <span class="price"><strong>${product.price} MZN</strong></span>
                `;
                productDiv.addEventListener('click', () => showProductDetails(product.name));
                main.appendChild(productDiv);
            });
        } else {
            const noStockMessage = document.createElement('div');
            noStockMessage.className = 'no-stock-message';
            noStockMessage.innerText = 'Stock esgotado';
            main.appendChild(noStockMessage);
        }
    }

// Função para ir para a página anterior
function previousPage() {
    showLoadingIndicator(); // Mostra o indicador de carregamento

    // Simula um atraso de 2 segundos antes de ir para a página anterior
    setTimeout(function () {
        if (currentPage > 1) {
            currentPage--;
            showProducts();
        }

        // Oculta o indicador de carregamento após o término da simulação
        setTimeout(hideLoadingIndicator, 2000);
    }, 2000);
}

// Função para ir para a próxima página
function nextPage() {
    showLoadingIndicator(); // Mostra o indicador de carregamento

    // Simula um atraso de 2 segundos antes de ir para a próxima página
    setTimeout(function () {
        const totalProducts = allProducts.length;
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            showProducts();
        }

        // Oculta o indicador de carregamento após o término da simulação
        setTimeout(hideLoadingIndicator, 2000);
    }, 2000);
}

// Funções de indicador de carregamento (mantive as mesmas funções do exemplo anterior)
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}


// Função para exibir detalhes do produto em um modal
function showProductDetails(productName) {
    const product = allProducts.find(product => product.name === productName);

    // Atualiza as variáveis de imagens para a modal
    images = [
        product.image,
        product.image1,
        product.image2,
        product.image3
    ].filter(img => img); // Adicione as imagens à matriz e remova valores nulos

    // Crie um modal para exibir detalhes do produto
    const modal = document.getElementById('productModal');

    // Simula o carregamento de detalhes do produto
    simulateProductDetailsLoading(product, modal);
}

// Função para simular o carregamento de detalhes do produto
function simulateProductDetailsLoading(product, modal) {
    showLoadingIndicator(); // Mostra o indicador de carregamento

    // Simula um atraso de 2 segundos antes de preencher o conteúdo do modal
    setTimeout(function () {
        // Adicione as informações do produto ao modal
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <div class="prev" onclick="prevImage()">&#10094;</div>
                <img id="modalImage" alt="">
                <div class="next" onclick="nextImage()">&#10095;</div>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <span class="price"><strong>${product.price} MZN</strong></span>
                <button onclick="buyProduct('${product.name}')">Encomendar</button>
            </div>
        `;

        // Exibe o modal
        modal.style.display = 'block';

        // Adicione uma classe ao corpo para esconder o overflow
        document.body.classList.add('modal-open');

        // Exibe a primeira imagem ao abrir o modal
        showImage(currentImageIndex);

        // Oculta o indicador de carregamento após o término da simulação
        setTimeout(hideLoadingIndicator, 800);
    }, 800);
}

// Funções de indicador de carregamento (mantive as mesmas funções do exemplo anterior)
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}


    // Função para fechar o modal
    function closeModal() {
        const modal = document.getElementById('productModal');
        modal.style.display = 'none';

        // Remova a classe do corpo para reativar o overflow
        document.body.classList.remove('modal-open');

        // Reinicia as variáveis de imagem ao fechar o modal
        currentImageIndex = 0;
        images = [];
    }

// Função simulada para comprar o produto (substitua por sua lógica real)
function buyProduct(productName) {
    const product = allProducts.find(product => product.name === productName);

    const message = `Encomenda%0A%0AProduto: ${product.name}%0ADescrição: ${product.description}%0APreço: ${product.price} MZN`;

    // Substitua '+258873698067' pelo seu número de telefone
    const whatsappURL = `https://api.whatsapp.com/send?phone=+258873698067&text=${message}`;

    // Abre a URL do WhatsApp em uma nova aba
    window.open(whatsappURL, '_blank');

    // Feche o modal após a compra (você pode ajustar conforme necessário)
    closeModal();
}


    // Função para exibir a imagem na modal
    function showImage(index) {
        const modalImage = document.getElementById('modalImage');

        if (images[index]) {
            modalImage.src = images[index];
            currentImageIndex = index;
        } else {
            console.error('Erro ao carregar a imagem. Índice inválido:', index);
        }
    }

    // Função para navegar para a próxima imagem
    function nextImage() {
        if (currentImageIndex < images.length - 1) {
            showImage(currentImageIndex + 1);
        } else {
            showImage(0);
        }
    }

    // Função para exibir/ocultar a barra de ferramentas
    function toggleMenu() {
        const toolbar = document.getElementById('toolbar');
        toolbar.style.display = (toolbar.style.display === 'block') ? 'none' : 'block';
    }

    function navigateTo(page) {
        window.location.href = page;
    }

    function filterProducts(category) {
        selectedCategory = category;
        currentPage = 1; // Reset a página atual ao selecionar uma nova categoria
        loadProducts();
    }

    // Atualize a função loadProducts para carregar produtos do nó correspondente à categoria selecionada
function loadProducts() {
    let categoryRef;

    // Verifique a categoria selecionada e crie a referência correspondente
    switch (selectedCategory.toLowerCase()) { 
        case 'camisas':
            categoryRef = camisasRef;
            break;
        case 'calcas':
            categoryRef = calcasRef;
            break;
        case 'sapatos':
            categoryRef = sapatosRef;
            break;
        case 'bolsas':
            categoryRef = bolsasRef;
            break;
        default:
            // Se nenhuma categoria específica for selecionada, use a referência principal
            categoryRef = produtosRef;
    }

    // Carregue produtos da categoria selecionada
    categoryRef.once('value')
        .then(snapshot => {
            const products = snapshot.val();
            if (products) {
                allProducts = Object.values(products);
                showProducts();
            } else {
                // Se não houver produtos na categoria selecionada, exiba uma mensagem apropriada
                const main = document.getElementById('main');
                main.innerHTML = '<div class="no-stock-message">Nenhum produto disponível nesta categoria</div>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar produtos do Firebase:', error);
        });
}
function simulateLoading(category) {
    showLoadingIndicator(); // Mostra o indicador de carregamento

    // Simula um atraso de 2 segundos antes de chamar a função filterProducts
    setTimeout(function() {
        filterProducts(category);

        // Oculta o indicador de carregamento após o término da simulação
        setTimeout(hideLoadingIndicator, 2000);
    }, 2000);
}


// Função para adicionar um novo produto ao Firebase
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').value;

    // Validar dados antes de adicionar ao Firebase
    if (productName && productDescription && productPrice && productImage) {
        // Adiciona o novo produto ao Firebase
        produtosRef.push({
            name: productName,
            description: productDescription,
            price: parseFloat(productPrice), // Converte para float
            image: productImage
        });

        // Limpa os campos do formulário
        document.getElementById('productName').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productImage').value = '';

        // Atualiza a exibição dos produtos
        loadProducts();
    } else {
        alert('Preencha todos os campos do formulário.');
    }
}

// Inicialize o carregamento de produtos
loadProducts();